import { Component, ChangeDetectionStrategy, inject, computed, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from "../../../services/i18n/i18n.service";
import { LocalerouteService } from 'src/app/services/route/localeroute.service';
import { SeoService } from 'src/app/services/seo/seo.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public i18n = inject(I18nService);
  public localeRoute = inject(LocalerouteService);
  private seo = inject(SeoService);
  public currentLang = computed(() => this.i18n.isEnglish() ? 'en' : 'fr');

  constructor() {
    effect(() => {
      const seoText = this.i18n.text().seo.home;
      this.seo.update({
        title: seoText.title,
        description: seoText.description,
        path: '',
        type: 'profile',
        jsonLd: [{
          '@type': 'ProfilePage',
          'mainEntity': { '@id': `${SeoService.BASE_URL}/#person` }
        }]
      });
    });
  }
}
