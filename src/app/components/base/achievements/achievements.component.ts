import { Component, ChangeDetectionStrategy, inject, computed, signal, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {I18nService} from "../../../services/i18n/i18n.service";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet
  ]
})
export class AchievementsComponent implements OnInit {
  public i18n = inject(I18nService);
  private titleService = inject(Title);
  private displayedCount = signal<number>(3);

  ngOnInit(): void {
    this.titleService.setTitle("Gaetan • " + this.i18n.text().title.achievements);
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
