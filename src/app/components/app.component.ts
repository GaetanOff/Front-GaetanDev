import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { I18nService } from "../services/i18n/i18n.service";
import { NgxSonnerToaster } from "ngx-sonner";
import { filter } from 'rxjs/operators';
import { LocalerouteService } from '../services/route/localeroute.service';
import { ChatbotComponent } from './include/chatbot/chatbot.component';
import { matchLocaleFromPath, stripLocalePrefix } from '../utils/locale.utils';

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
    const initialLang = matchLocaleFromPath(this.router.url);
    if (initialLang) {
      this.i18n.setLanguage(initialLang);
    }

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.isAdminRoute.set(event.url.startsWith('/admin'));
      const urlLang = matchLocaleFromPath(event.url);
      if (urlLang) {
        this.i18n.setLanguage(urlLang);
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

  onSwitchLanguage(): void {
    const currentUrl = this.router.url;
    const lang = matchLocaleFromPath(currentUrl);

    if (lang) {
      const currentPath = stripLocalePrefix(currentUrl);
      const newLang = this.i18n.isEnglish() ? 'fr' : 'en';
      this.router.navigate([`/${newLang}${currentPath}`]);
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
