import { Component, ChangeDetectionStrategy, inject, computed, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from "../../../services/i18n/i18n.service";
import { SeoService } from "../../../services/seo/seo.service";

@Component({
  selector: 'app-error',
  imports: [RouterLink],
  templateUrl: './error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  public i18n = inject(I18nService);
  private seo = inject(SeoService);
  public currentLang = computed(() => this.i18n.isEnglish() ? 'en' : 'fr');

  constructor() {
    effect(() => {
      const seoText = this.i18n.text().seo.error;
      this.seo.update({
        title: seoText.title,
        description: seoText.description,
        path: '',
        noindex: true
      });
    });
  }

  public getLocalizedRoute(route: string): string {
    // Use the same logic as app.component - detect if we're on a route with or without prefix
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.pathname;
      const hasLangPrefix = /^\/(fr|en)(\/|$)/.test(currentUrl);

      if (hasLangPrefix) {
        const lang = this.currentLang();
        const cleanRoute = route.startsWith('/') ? route.substring(1) : route;
        return `/${lang}/${cleanRoute}`;
      }
    }
    // No prefix - return route as is
    return route.startsWith('/') ? route : `/${route}`;
  }
}
