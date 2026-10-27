import { Component, ChangeDetectionStrategy, inject, signal, output, viewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { NgxTurnstileComponent, NgxTurnstileModule } from 'ngx-turnstile';

// ngx-turnstile n'injecte pas son script si un élément porte cet id, et rend alors le
// widget tout de suite : il ne faut donc créer <ngx-turnstile> qu'une fois le script chargé.
const TURNSTILE_SCRIPT_ID = 'ngx-turnstile';
const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let turnstileScript: Promise<void> | null = null;

function loadTurnstileScript(document: Document): Promise<void> {
  turnstileScript ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      // Permet une nouvelle tentative au prochain affichage du captcha.
      script.remove();
      turnstileScript = null;
      reject(new Error('Turnstile script failed to load'));
    };
    document.head.appendChild(script);
  });
  return turnstileScript;
}

@Component({
  selector: 'app-custom-captcha',
  standalone: true,
  imports: [CommonModule, NgxTurnstileModule],
  template: `
    <div class="w-full flex justify-center">
      @if (scriptReady()) {
        <ngx-turnstile
          [siteKey]="siteKey"
          [tabIndex]="0"
          theme="dark"
          (resolved)="onTurnstileResolved($event)">
        </ngx-turnstile>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCaptchaComponent {
  siteKey: string = "0x4AAAAAAAQVPyoNLB-x1-gG";
  tokenResolved = output<string | null>();

  public state = signal<'idle' | 'verified' | 'error'>('idle');
  protected scriptReady = signal(false);

  private turnstile = viewChild(NgxTurnstileComponent);

  constructor() {
    loadTurnstileScript(inject(DOCUMENT)).then(
      () => this.scriptReady.set(true),
      () => this.state.set('error')
    );
  }

  /** Réaffiche un challenge neuf : un jeton Turnstile n'est valable qu'une fois. */
  reset() {
    this.turnstile()?.reset();
    this.state.set('idle');
  }

  onTurnstileResolved(token: string | null) {
    if (token) {
      this.state.set('verified');
      this.tokenResolved.emit(token);
    } else {
      this.state.set('error');
      this.tokenResolved.emit(null);
    }
  }
}
