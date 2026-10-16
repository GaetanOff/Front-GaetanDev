import { Component, ChangeDetectionStrategy, DestroyRef, ElementRef, NgZone, computed, effect, inject, signal, untracked, viewChild, viewChildren } from '@angular/core';
import { I18nService } from '../../../services/i18n/i18n.service';
import { TourService } from '../../../services/tour/tour.service';

/** Space kept between the spotlight and the highlighted element. */
const SPOT_PADDING = 14;
/** Minimum distance between the spotlight and the viewport edges. */
const VIEWPORT_MARGIN = 8;
/** Room taken by the fixed navbar at the top of the viewport. */
const NAVBAR_HEIGHT = 96;
/** Distance between the caption card and the viewport bottom (see .tour-card). */
const CARD_OFFSET = 104;
/** Frequency bins (out of 32) driving each bar of the orb. */
const BAR_BINS = [2, 4, 6, 9, 13];

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKeydown($event)'
  }
})
export class TourComponent {
  public tour = inject(TourService);
  public i18n = inject(I18nService);
  private zone = inject(NgZone);

  public t = computed(() => this.i18n.text().tour);
  public bars = BAR_BINS;
  public counter = computed(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(this.tour.index() + 1)} / ${pad(this.tour.steps.length)}`;
  });

  /** Caption split in words, each carrying its trailing space. */
  public words = computed(() => this.tour.text().text.split(/\s+/).map(word => `${word} `));
  /** Character offset at which each word ends, to sync captions with playback. */
  private wordEnds = computed(() => {
    let total = 0;
    return this.words().map(word => total += word.length);
  });
  public spoken = signal<number>(0);
  public placement = signal<'top' | 'bottom'>('bottom');

  private spot = viewChild<ElementRef<HTMLElement>>('spot');
  private card = viewChild<ElementRef<HTMLElement>>('card');
  private orb = viewChild<ElementRef<HTMLElement>>('orb');
  private fill = viewChild<ElementRef<HTMLElement>>('fill');
  private barEls = viewChildren<ElementRef<HTMLElement>>('bar');

  private frame = 0;

  constructor() {
    effect(() => {
      if (this.tour.active()) {
        untracked(() => this.startLoop());
      }
    });

    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(this.frame));
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.tour.active()) return;
    const target = event.target;
    if (target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')) return;

    switch (event.key) {
      case 'Escape':
        this.tour.stop();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.tour.next();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.tour.prev();
        break;
    }
  }

  // The animation loop runs outside Angular and writes straight to the DOM:
  // signals are only touched when a value visible in the template changes.
  private startLoop(): void {
    if (this.frame) return;
    this.zone.runOutsideAngular(() => {
      const tick = (now: number) => {
        if (!this.tour.active()) {
          this.frame = 0;
          return;
        }
        this.updateSpotlight();
        this.updateCaptions();
        this.updateOrb(now);
        this.frame = requestAnimationFrame(tick);
      };
      this.frame = requestAnimationFrame(tick);
    });
  }

  private updateSpotlight(): void {
    const spot = this.spot()?.nativeElement;
    if (!spot) return;

    const name = this.tour.step().target;
    const el = name ? document.querySelector<HTMLElement>(`[data-tour="${name}"]`) : null;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (!el) {
      this.setRect(spot, vw / 2, vh / 2, 0, 0);
      return;
    }

    const rect = el.getBoundingClientRect();
    const top = Math.max(VIEWPORT_MARGIN, rect.top - SPOT_PADDING);
    const left = Math.max(VIEWPORT_MARGIN, rect.left - SPOT_PADDING);
    const bottom = Math.min(vh - VIEWPORT_MARGIN, rect.bottom + SPOT_PADDING);
    const right = Math.min(vw - VIEWPORT_MARGIN, rect.right + SPOT_PADDING);
    this.setRect(spot, left, top, Math.max(0, right - left), Math.max(0, bottom - top));

    // Keep the caption card away from what is being presented: it moves to the
    // top only when it doesn't fit below the element but fits above it.
    const cardHeight = this.card()?.nativeElement.offsetHeight ?? 0;
    const fitsBelow = vh - rect.bottom >= cardHeight + CARD_OFFSET;
    const fitsAbove = rect.top - NAVBAR_HEIGHT >= cardHeight;
    const placement = !fitsBelow && fitsAbove ? 'top' : 'bottom';
    if (placement !== this.placement()) {
      this.zone.run(() => this.placement.set(placement));
    }
  }

  private setRect(el: HTMLElement, x: number, y: number, width: number, height: number): void {
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
  }

  private updateCaptions(): void {
    const progress = this.tour.progress();
    this.fill()?.nativeElement.style.setProperty('transform', `scaleX(${progress})`);

    const ends = this.wordEnds();
    const reached = progress * (ends[ends.length - 1] ?? 0);
    let spoken = ends.findIndex(end => end > reached);
    if (spoken === -1) spoken = ends.length;

    if (spoken !== this.spoken()) {
      this.zone.run(() => this.spoken.set(spoken));
    }
  }

  private updateOrb(now: number): void {
    const levels = this.tour.readLevels();
    const speaking = !this.tour.paused() && this.tour.progress() > 0 && this.tour.progress() < 1;
    let sum = 0;

    this.barEls().forEach((bar, i) => {
      let value: number;
      if (levels) {
        value = levels[BAR_BINS[i]] / 255;
      } else if (speaking) {
        // No analyser data (captions-only mode): synthesize a voice-like motion.
        value = 0.35 + 0.3 * Math.sin(now / 170 + i * 1.4) * Math.sin(now / 420 + i);
      } else {
        value = 0.08;
      }
      sum += value;
      bar.nativeElement.style.transform = `scaleY(${0.18 + value * 0.82})`;
    });

    this.orb()?.nativeElement.style.setProperty('--level', (sum / BAR_BINS.length).toFixed(3));
  }
}
