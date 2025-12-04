import { Component, ChangeDetectionStrategy, inject, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {I18nService} from "../../../services/i18n/i18n.service";

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  public i18n = inject(I18nService);
  private titleService = inject(Title);
  public currentLang = computed(() => this.i18n.isEnglish() ? 'en' : 'fr');

  ngOnInit(): void {
    this.titleService.setTitle("Gaetan • DevOps");
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
