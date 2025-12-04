import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd} from '@angular/router';
import {I18nService} from "../services/i18n/i18n.service";
import {NgxSonnerToaster} from "ngx-sonner";
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgxSonnerToaster],
})
export class AppComponent {
  public i18n = inject(I18nService);
  private router = inject(Router);
  private _isMenuOpen = signal<boolean>(false);
  public isMenuOpen = computed(() => this._isMenuOpen());
  public isAdminRoute = signal<boolean>(false);

  constructor() {
    // Detect language from initial URL
    const initialUrl = this.router.url;
    const langMatch = initialUrl.match(/^\/(fr|en)(\/|$)/);
    if (langMatch) {
      const lang = langMatch[1] as 'fr' | 'en';
      this.i18n.setLanguage(lang);
    }
    // If no language prefix, the guard will handle it and use default language

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute.set(event.url.startsWith('/admin'));
      // Update language on navigation if URL has language prefix
      const urlMatch = event.url.match(/^\/(fr|en)(\/|$)/);
      if (urlMatch) {
        const lang = urlMatch[1] as 'fr' | 'en';
        this.i18n.setLanguage(lang);
      }
      // Scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // Check initial route
    this.isAdminRoute.set(this.router.url.startsWith('/admin'));
  }

  public languageImg = computed(() =>
    this.i18n.isEnglish()
      ? 'assets/img/english.svg' // UK flag
      : 'assets/img/france.svg' // France flag
  );

  public currentLang = computed(() => this.i18n.isEnglish() ? 'en' : 'fr');

  private getCurrentPath(): string {
    const url = this.router.url;
    // Remove language prefix if present
    const match = url.match(/^\/(fr|en)(\/.*)?$/);
    if (match) {
      return match[2] || '';
    }
    return url;
  }

  public getLocalizedRoute(route: string): string {
    const currentUrl = this.router.url;
    const hasLangPrefix = /^\/(fr|en)(\/|$)/.test(currentUrl);
    
    if (hasLangPrefix) {
      // If current URL has language prefix, keep it in the route
      const lang = this.currentLang();
      const cleanRoute = route.startsWith('/') ? route.substring(1) : route;
      return `/${lang}/${cleanRoute}`;
    } else {
      // If current URL has no language prefix, return route without prefix
      return route.startsWith('/') ? route : `/${route}`;
    }
  }

  onSwitchLanguage(): void {
    const currentUrl = this.router.url;
    const langMatch = currentUrl.match(/^\/(fr|en)(\/.*)?$/);
    
    if (langMatch) {
      // Current URL has language prefix - switch it
      const currentPath = langMatch[2] || '';
      const newLang = this.i18n.isEnglish() ? 'fr' : 'en';
      const newPath = `/${newLang}${currentPath}`;
      this.router.navigate([newPath]);
    } else {
      // Current URL has no language prefix - just toggle language
      this.i18n.toggleLanguage();
    }
  }

  toggleMenu(): void {
    this._isMenuOpen.update(value => !value);
  }

  closeMenu(): void {
    this._isMenuOpen.set(false);
  }
}
