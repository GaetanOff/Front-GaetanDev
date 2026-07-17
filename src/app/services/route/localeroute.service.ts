import { Injectable, computed } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../i18n/i18n.service';
import { hasLocalePrefix } from '../../utils/locale.utils';

@Injectable({
  providedIn: 'root'
})
export class LocalerouteService {
  public readonly currentLang = computed(() => this.i18nService.isEnglish() ? 'en' : 'fr');

  constructor(
    private router: Router,
    private i18nService: I18nService
  ) { }

  public getLocalizedRoute(route: string): string {
    const currentUrl = this.router.url;

    if (hasLocalePrefix(currentUrl)) {
      const lang = this.currentLang();
      const cleanRoute = route.startsWith('/') ? route.substring(1) : route;
      return `/${lang}/${cleanRoute}`;
    }

    return route.startsWith('/') ? route : `/${route}`;
  }
}
