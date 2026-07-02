
import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { ServicesComponent } from "../../include/services/services.component";
import { CompetencesComponent } from "../../include/cv/competences/competences.component";
import { ExperienceComponent } from "../../include/cv/experience/experience.component";
import { CertifComponent } from "../../include/cv/certif/certif.component";
import { LanguagesComponent } from "../../include/cv/languages/languages.component";
import { I18nService } from "../../../services/i18n/i18n.service";
import { SeoService } from "../../../services/seo/seo.service";
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  imports: [
    ServicesComponent,
    CompetencesComponent,
    ExperienceComponent,
    CertifComponent,
    LanguagesComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  public i18n = inject(I18nService);
  private seo = inject(SeoService);

  constructor() {
    effect(() => {
      const text = this.i18n.text();
      const seoText = text.seo.about;
      this.seo.update({
        title: seoText.title,
        description: seoText.description,
        path: '/about',
        type: 'profile',
        jsonLd: [{
          '@type': 'OfferCatalog',
          'name': text.services.title,
          'itemListElement': [
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': text.services.devTitle,
                'description': text.services.dev.join(', '),
                'provider': { '@id': `${SeoService.BASE_URL}/#person` }
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': text.services.devopsTitle,
                'description': text.services.devops.join(', '),
                'provider': { '@id': `${SeoService.BASE_URL}/#person` }
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': text.services.iaTitle,
                'description': text.services.ia.join(', '),
                'provider': { '@id': `${SeoService.BASE_URL}/#person` }
              }
            }
          ]
        }]
      });
    });
  }

  processForm(): void {
    toast.error(this.i18n.text().about.cvNotAvailable);
  }
}
