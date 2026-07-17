import { Injectable, signal, computed, effect } from '@angular/core';
import { matchLocaleFromPath } from '../../utils/locale.utils';
import fr from '../../../assets/i18n/fr.json';
import en from '../../../assets/i18n/en.json';

export type TranslationTexts = typeof fr;

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private _isEnglish = signal<boolean>(this.getInitialLanguage());

  public readonly isEnglish = this._isEnglish.asReadonly();
  public readonly text = computed<TranslationTexts>(() =>
    this.isEnglish() ? en : fr
  );

  constructor() {
    effect(() => {
      try {
        localStorage.setItem('isEnglish', JSON.stringify(this.isEnglish()));
      } catch (e) {
        console.error('Could not access localStorage.', e);
      }
    });
  }

  private getInitialLanguage(): boolean {
    if (typeof window !== 'undefined') {
      const lang = matchLocaleFromPath(window.location.pathname);
      if (lang) {
        return lang === 'en';
      }
    }

    try {
      const storedLang = localStorage.getItem('isEnglish');
      return storedLang ? JSON.parse(storedLang) : false;
    } catch (e) {
      console.error('Could not access localStorage.', e);
      return false;
    }
  }

  public toggleLanguage(): void {
    this._isEnglish.update(isEnglish => !isEnglish);
  }

  public setLanguage(lang: 'fr' | 'en'): void {
    this._isEnglish.set(lang === 'en');
  }
}
