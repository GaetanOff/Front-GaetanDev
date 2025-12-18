import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  input,
  output,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../services/i18n/i18n.service';

const getTurnstileAPI = (): any =>
  (globalThis as any).turnstile || (window as any).turnstile;

@Component({
  selector: 'app-custom-captcha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-captcha.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCaptchaComponent implements AfterViewInit, OnDestroy {
  @ViewChild('turnstileContainer') turnstileContainer!: ElementRef<HTMLDivElement>;

  private i18n = inject(I18nService);
  private cdr = inject(ChangeDetectorRef);

  siteKey = input.required<string>();
  tokenResolved = output<string | null>();

  state = signal<'idle' | 'verified' | 'error'>('idle');
  private widgetId: string | null = null;

  get captchaTexts() {
    return this.i18n.text().contact.captcha;
  }

  async ngAfterViewInit() {
    await this.waitForTurnstile();

    const turnstile = getTurnstileAPI();
    if (!turnstile) {
      this.state.set('error');
      return;
    }

    this.widgetId = turnstile.render(this.turnstileContainer.nativeElement, {
      sitekey: this.siteKey(),
      appearance: 'interaction-only',
      callback: (token: string) => {
        this.state.set('verified');
        this.tokenResolved.emit(token);
        this.cdr.detectChanges();
      },
      'error-callback': () => {
        this.state.set('error');
        this.tokenResolved.emit(null);
        this.cdr.detectChanges();
      },
      'expired-callback': () => {
        this.state.set('idle');
        this.tokenResolved.emit(null);
        this.cdr.detectChanges();
      },
    });
  }

  private waitForTurnstile(): Promise<void> {
    return new Promise((resolve) => {
      if (getTurnstileAPI()) return resolve();

      const interval = setInterval(() => {
        if (getTurnstileAPI()) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  ngOnDestroy() {
    const turnstile = getTurnstileAPI();
    if (this.widgetId && turnstile) {
      try {
        turnstile.remove(this.widgetId);
      } catch {}
    }
  }
}
