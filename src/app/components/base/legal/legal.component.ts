import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { I18nService } from "../../../services/i18n/i18n.service";
import { SeoService } from "../../../services/seo/seo.service";

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalComponent {
  public i18n = inject(I18nService);
  private seo = inject(SeoService);

  constructor() {
    effect(() => {
      const seoText = this.i18n.text().seo.legal;
      this.seo.update({
        title: seoText.title,
        description: seoText.description,
        path: '/legal'
      });
    });
  }
}
