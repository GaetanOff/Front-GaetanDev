import { Component, ChangeDetectionStrategy, inject, computed, signal, effect } from '@angular/core';
import { I18nService } from "../../../services/i18n/i18n.service";
import { SeoService } from "../../../services/seo/seo.service";
import { NgTemplateOutlet } from "@angular/common";

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet
  ]
})
export class AchievementsComponent {
  public i18n = inject(I18nService);
  private seo = inject(SeoService);
  private displayedCount = signal<number>(3);

  constructor() {
    effect(() => {
      const text = this.i18n.text();
      const seoText = text.seo.achievements;
      this.seo.update({
        title: seoText.title,
        description: seoText.description,
        path: '/achievements',
        jsonLd: [{
          '@type': 'ItemList',
          'name': text.achievements.title,
          'description': text.achievements.description,
          'itemListElement': text.achievements.list.map((project, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'item': {
              '@type': 'CreativeWork',
              'name': project.name,
              'description': project.description,
              ...(project.redirect ? { 'url': project.redirect } : {}),
              'author': { '@id': `${SeoService.BASE_URL}/#person` }
            }
          }))
        }]
      });
    });
  }

  public displayedList = computed(() => {
    const allProjects = this.i18n.text().achievements.list;
    return allProjects.slice(0, this.displayedCount());
  });

  public hasMore = computed(() => {
    const totalProjects = this.i18n.text().achievements.list.length;
    return this.displayedCount() < totalProjects;
  });

  public hasLess = computed(() => {
    return this.displayedCount() > 3;
  });

  public showMore(): void {
    const totalProjects = this.i18n.text().achievements.list.length;
    this.displayedCount.update(count => Math.min(count + 3, totalProjects));
  }

  public showLess(): void {
    this.displayedCount.update(count => Math.max(count - 3, 3));
  }
}
