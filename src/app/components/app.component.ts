import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { I18nService } from "../services/i18n/i18n.service";
import { NgxSonnerToaster } from "ngx-sonner";
import { filter } from 'rxjs/operators';
import { LocalerouteService } from '../services/route/localeroute.service';
import { ChatbotComponent } from './include/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgxSonnerToaster, ChatbotComponent],
})
export class AppComponent {
  public i18n = inject(I18nService);
  public localeRoute = inject(LocalerouteService);
  private router = inject(Router);
  private _isMenuOpen = signal<boolean>(false);
  public isMenuOpen = computed(() => this._isMenuOpen());
  public isAdminRoute = signal<boolean>(false);

  constructor() {
    const initialUrl = this.router.url;
    const langMatch = initialUrl.match(/^\/(fr|en)(\/|$)/);
    if (langMatch) {
      const lang = langMatch[1] as 'fr' | 'en';
      this.i18n.setLanguage(lang);
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute.set(event.url.startsWith('/admin'));
      const urlMatch = event.url.match(/^\/(fr|en)(\/|$)/);
      if (urlMatch) {
        const lang = urlMatch[1] as 'fr' | 'en';
        this.i18n.setLanguage(lang);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    this.isAdminRoute.set(this.router.url.startsWith('/admin'));
  }

  public languageImg = computed(() =>
    this.i18n.isEnglish()
      ? 'assets/img/english.svg'
      : 'assets/img/france.svg'
  );

  public currentLang = computed(() => this.i18n.isEnglish() ? 'en' : 'fr');

  private getCurrentPath(): string {
    const url = this.router.url;
    const match = url.match(/^\/(fr|en)(\/.*)?$/);
    if (match) {
      return match[2] || '';
    }
    return url;
  }

  onSwitchLanguage(): void {
    const currentUrl = this.router.url;
    const langMatch = currentUrl.match(/^\/(fr|en)(\/.*)?$/);

    if (langMatch) {
      const currentPath = langMatch[2] || '';
      const newLang = this.i18n.isEnglish() ? 'fr' : 'en';
      const newPath = `/${newLang}${currentPath}`;
      this.router.navigate([newPath]);
    } else {
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
