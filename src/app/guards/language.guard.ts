import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { I18nService } from '../services/i18n/i18n.service';
import { matchLocaleFromPath } from '../utils/locale.utils';

@Injectable({
  providedIn: 'root'
})
export class LanguageGuard implements CanActivate {
  constructor(private i18n: I18nService) { }

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const lang = matchLocaleFromPath(state.url);

    if (lang) {
      this.i18n.setLanguage(lang);
      return true;
    }

    try {
      const storedLang = localStorage.getItem('isEnglish');
      const isEnglish = storedLang ? JSON.parse(storedLang) : false;
      this.i18n.setLanguage(isEnglish ? 'en' : 'fr');
    } catch {
      this.i18n.setLanguage('fr');
    }
    return true;
  }
}
