import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { I18nService } from '../services/i18n/i18n.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageGuard implements CanActivate {
  constructor(
    private i18n: I18nService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const url = state.url;
    const langMatch = url.match(/^\/(fr|en)(\/|$)/);

    if (langMatch) {
      const lang = langMatch[1] as 'fr' | 'en';
      this.i18n.setLanguage(lang);
      return true;
    }

    try {
      const storedLang = localStorage.getItem('isEnglish');
      const isEnglish = storedLang ? JSON.parse(storedLang) : false;
      this.i18n.setLanguage(isEnglish ? 'en' : 'fr');
    } catch (e) {
      this.i18n.setLanguage('fr');
    }
    return true;
  }
}

