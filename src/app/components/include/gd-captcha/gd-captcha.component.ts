import { ChangeDetectionStrategy, Component, DOCUMENT, ElementRef, effect, inject, output, signal, untracked, viewChild } from '@angular/core';
import { I18nService } from '../../../services/i18n/i18n.service';

/** Sous-ensemble de l'API `window.gdCaptcha` exposée par https://captcha.gaetandev.fr/v1/api.js. */
export interface GdCaptchaApi {
  ready(callback: () => void): void;
  render(container: HTMLElement, options: GdCaptchaRenderOptions): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

export interface GdCaptchaRenderOptions {
  sitekey: string;
  theme?: 'auto' | 'light' | 'dark';
  language?: 'auto' | 'fr' | 'en';
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: (code: string) => void;
  'response-field'?: boolean;
}

type GdCaptchaWindow = Window & { gdCaptcha?: GdCaptchaApi };

// render=explicit : le script ne rend pas les `.gd-captcha` tout seul, c'est ce composant qui appelle render().
const GD_CAPTCHA_SCRIPT_URL = 'https://captcha.gaetandev.fr/v1/api.js?render=explicit';
const GD_CAPTCHA_SITE_KEY = 'gd_site_u9d-Fl_dKJwr0nBrXQhMkda8';

let gdCaptchaScript: Promise<GdCaptchaApi> | null = null;

function whenReady(api: GdCaptchaApi): Promise<GdCaptchaApi> {
  return new Promise(resolve => api.ready(() => resolve(api)));
}

function loadGdCaptchaScript(document: Document): Promise<GdCaptchaApi> {
  const win = document.defaultView as GdCaptchaWindow | null;
  if (win?.gdCaptcha) {
    return whenReady(win.gdCaptcha);
  }
  gdCaptchaScript ??= new Promise<GdCaptchaApi>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GD_CAPTCHA_SCRIPT_URL;
    script.async = true;
    const fail = () => {
      // Permet une nouvelle tentative au prochain affichage du captcha.
      script.remove();
      gdCaptchaScript = null;
      reject(new Error('GaetanDev Captcha script failed to load'));
    };
    script.onload = () => (win?.gdCaptcha ? whenReady(win.gdCaptcha).then(resolve) : fail());
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return gdCaptchaScript;
}

@Component({
  selector: 'app-gd-captcha',
  template: `
    <div class="w-full flex justify-center">
      <div #container></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GdCaptchaComponent {
  private i18n = inject(I18nService);

  tokenResolved = output<string | null>();
  public state = signal<'idle' | 'verified' | 'error'>('idle');

  private api = signal<GdCaptchaApi | null>(null);
  private container = viewChild<ElementRef<HTMLElement>>('container');
  private widgetId: string | null = null;

  constructor() {
    loadGdCaptchaScript(inject(DOCUMENT)).then(
      api => this.api.set(api),
      () => this.state.set('error')
    );

    // Rend le widget dès que le script est prêt, et le recrée quand la langue change
    // (sur les routes sans préfixe, la langue bascule sans recréer la page).
    effect(onCleanup => {
      const api = this.api();
      const container = this.container()?.nativeElement;
      const language = this.i18n.isEnglish() ? 'en' : 'fr';
      if (!api || !container) return;

      untracked(() => {
        // Le jeton de l'ancien widget est abandonné avec lui.
        if (this.state() === 'verified') this.tokenResolved.emit(null);
        this.state.set('idle');

        const widgetId = api.render(container, {
          sitekey: GD_CAPTCHA_SITE_KEY,
          theme: 'dark',
          language,
          // Le jeton est lu via `callback` : pas de champ caché dans le formulaire réactif.
          'response-field': false,
          callback: token => this.onResolved(token),
          // Le widget se relance seul après expiration et rappellera `callback`.
          'expired-callback': () => this.onResolved(null, 'idle'),
          'error-callback': () => this.onResolved(null, 'error'),
        });
        this.widgetId = widgetId;
        onCleanup(() => {
          api.remove(widgetId);
          this.widgetId = null;
        });
      });
    });
  }

  /** Relance une vérification neuve : un jeton n'est valable qu'une fois. */
  reset() {
    const api = this.api();
    if (api && this.widgetId) api.reset(this.widgetId);
    this.state.set('idle');
  }

  private onResolved(token: string | null, failure: 'idle' | 'error' = 'error') {
    this.state.set(token ? 'verified' : failure);
    this.tokenResolved.emit(token);
  }
}
