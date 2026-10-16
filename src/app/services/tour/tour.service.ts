import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../i18n/i18n.service';
import { LocalerouteService } from '../route/localeroute.service';
import { AppLocale, stripLocalePrefix } from '../../utils/locale.utils';
import { TOUR_STEPS, tourAudioSrc } from './tour.steps';

const SEEN_KEY = 'voiceTourSeen';
/** Pause between the end of a step and the next one. */
const ADVANCE_DELAY_MS = 700;
/** Time left to the page to scroll/settle before the voice starts. */
const SETTLE_DELAY_MS = 450;
const TARGET_TIMEOUT_MS = 3000;
/** Reading speed used to time captions when an MP3 is missing. */
const WORDS_PER_SECOND = 2.6;

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private router = inject(Router);
  private i18n = inject(I18nService);
  private localeRoute = inject(LocalerouteService);

  public readonly steps = TOUR_STEPS;

  private _active = signal<boolean>(false);
  private _index = signal<number>(0);
  private _paused = signal<boolean>(false);
  private _audioMissing = signal<boolean>(false);
  private _seen = signal<boolean>(this.readSeen());

  public readonly active = this._active.asReadonly();
  public readonly index = this._index.asReadonly();
  public readonly paused = this._paused.asReadonly();
  public readonly audioMissing = this._audioMissing.asReadonly();
  public readonly seen = this._seen.asReadonly();
  public readonly step = computed(() => TOUR_STEPS[this._index()]);
  public readonly text = computed(() => this.i18n.text().tour.steps[this.step().id]);
  public readonly isFirst = computed(() => this._index() === 0);
  public readonly isLast = computed(() => this._index() === TOUR_STEPS.length - 1);

  private lang = computed<AppLocale>(() => this.i18n.isEnglish() ? 'en' : 'fr');

  private audio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private levels: Uint8Array<ArrayBuffer> | null = null;

  /** Incremented on every step change so stale async work can bail out. */
  private run = 0;
  private timer?: ReturnType<typeof setTimeout>;

  // Simulated clock, used when the MP3 of a step can't be played.
  private simulated = false;
  private simDuration = 0;
  private simElapsed = 0;
  private simStartedAt = 0;

  constructor() {
    let lang = this.lang();
    effect(() => {
      const next = this.lang();
      if (next === lang) return;
      lang = next;
      untracked(() => {
        if (this._active()) {
          this.goTo(this._index());
        }
      });
    });
  }

  public toggle(): void {
    this._active() ? this.stop() : this.start();
  }

  public start(): void {
    if (this._active()) return;

    const audio = this.ensureAudio();
    // Unlock playback while we are still inside the user gesture (Safari / iOS).
    this.audioCtx?.resume().catch(() => { });
    audio.muted = true;
    audio.src = tourAudioSrc(this.lang(), 0);
    audio.play().then(() => {
      if (audio.muted) audio.pause();
    }).catch(() => { });

    this.markSeen();
    this._active.set(true);
    this.goTo(0);
  }

  public stop(): void {
    this.run++;
    this.halt();
    this._active.set(false);
    this._paused.set(false);
  }

  public next(): void {
    this.isLast() ? this.stop() : this.goTo(this._index() + 1);
  }

  public prev(): void {
    if (!this.isFirst()) this.goTo(this._index() - 1);
  }

  public togglePause(): void {
    this._paused() ? this.resume() : this.pause();
  }

  public pause(): void {
    if (!this._active() || this._paused()) return;
    this._paused.set(true);
    clearTimeout(this.timer);

    if (this.simulated) {
      this.simElapsed += (performance.now() - this.simStartedAt) / 1000;
      this.simStartedAt = 0;
    } else {
      this.audio?.pause();
    }
  }

  public resume(): void {
    if (!this._active() || !this._paused()) return;
    this._paused.set(false);
    const run = this.run;

    if (this.simulated) {
      this.simStartedAt = performance.now();
      this.armSimTimer(run);
    } else if (this.audio?.ended) {
      this.scheduleAdvance(run);
    } else {
      this.audio?.play().catch(() => this.simulate(run));
    }
  }

  /** Playback progress of the current step, from 0 to 1. */
  public progress(): number {
    if (this.simulated) {
      const running = this.simStartedAt ? (performance.now() - this.simStartedAt) / 1000 : 0;
      return Math.min(1, (this.simElapsed + running) / this.simDuration);
    }
    const audio = this.audio;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return 0;
    return Math.min(1, audio.currentTime / audio.duration);
  }

  /** Live frequency data of the voice, or null when no real audio is playing. */
  public readLevels(): Uint8Array | null {
    if (!this.analyser || !this.levels || this.simulated || this._paused() || !this.audio || this.audio.paused) {
      return null;
    }
    this.analyser.getByteFrequencyData(this.levels);
    return this.levels;
  }

  public async goTo(index: number): Promise<void> {
    if (index < 0 || index >= TOUR_STEPS.length) return;

    const run = ++this.run;
    this.halt();
    this._index.set(index);
    this._paused.set(false);
    this._audioMissing.set(false);

    const step = TOUR_STEPS[index];
    await this.ensureRoute(step.route);
    if (run !== this.run) return;

    const target = step.target ? await this.waitForTarget(step.target) : null;
    if (run !== this.run) return;

    if (target) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const tall = target.getBoundingClientRect().height > window.innerHeight * 0.6;
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: tall ? 'start' : 'center' });
    }

    await delay(SETTLE_DELAY_MS);
    if (run !== this.run) return;

    this.play(index, run);
  }

  private play(index: number, run: number): void {
    const audio = this.ensureAudio();
    this.audioCtx?.resume().catch(() => { });

    audio.onended = () => this.scheduleAdvance(run);
    audio.onerror = () => this.simulate(run);
    audio.muted = false;
    audio.src = tourAudioSrc(this.lang(), index);

    if (!this._paused()) {
      audio.play().catch((err: DOMException) => {
        if (err.name !== 'AbortError') this.simulate(run);
      });
    }
  }

  /** Falls back to captions only, timed on an estimated reading speed. */
  private simulate(run: number): void {
    if (run !== this.run || this.simulated) return;

    this.audio?.pause();
    this.simulated = true;
    this._audioMissing.set(true);

    const words = this.text().text.split(/\s+/).length;
    this.simDuration = Math.max(4, words / WORDS_PER_SECOND);
    this.simElapsed = 0;
    this.simStartedAt = this._paused() ? 0 : performance.now();
    this.armSimTimer(run);
  }

  private armSimTimer(run: number): void {
    clearTimeout(this.timer);
    if (!this.simStartedAt) return;
    const remaining = Math.max(0, this.simDuration - this.simElapsed) * 1000;
    this.timer = setTimeout(() => this.scheduleAdvance(run), remaining);
  }

  private scheduleAdvance(run: number): void {
    if (run !== this.run || this._paused()) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (run === this.run) this.next();
    }, ADVANCE_DELAY_MS);
  }

  /** Stops whatever the current step is doing, without leaving the tour. */
  private halt(): void {
    clearTimeout(this.timer);
    this.simulated = false;
    this.simStartedAt = 0;
    if (this.audio) {
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio.pause();
    }
  }

  private ensureAudio(): HTMLAudioElement {
    if (this.audio) return this.audio;

    const audio = new Audio();
    audio.preload = 'auto';
    this.audio = audio;

    // Route the voice through an analyser to animate the orb with the real signal.
    try {
      this.audioCtx = new AudioContext();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.75;
      this.audioCtx.createMediaElementSource(audio).connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
      this.levels = new Uint8Array(this.analyser.frequencyBinCount);
    } catch {
      this.audioCtx = null;
      this.analyser = null;
      this.levels = null;
    }

    return audio;
  }

  private async ensureRoute(route: string): Promise<void> {
    const currentPath = stripLocalePrefix(this.router.url.split(/[?#]/)[0]);
    if (normalizePath(currentPath) === normalizePath(route)) return;
    // getLocalizedRoute('/') gives '/fr/', which navigateByUrl doesn't match.
    await this.router.navigateByUrl(normalizePath(this.localeRoute.getLocalizedRoute(route)));
  }

  private async waitForTarget(name: string): Promise<HTMLElement | null> {
    const deadline = performance.now() + TARGET_TIMEOUT_MS;
    while (performance.now() < deadline) {
      const el = document.querySelector<HTMLElement>(`[data-tour="${name}"]`);
      if (el) return el;
      await delay(100);
    }
    return null;
  }

  private readSeen(): boolean {
    try {
      return localStorage.getItem(SEEN_KEY) === '1';
    } catch {
      return false;
    }
  }

  private markSeen(): void {
    this._seen.set(true);
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      // Storage unavailable (private mode): the hint will just show again next time.
    }
  }
}
