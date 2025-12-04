import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import {I18nService} from "../../../services/i18n/i18n.service";

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementsComponent {
  public i18n = inject(I18nService);
  private showAll = signal<boolean>(false);
  
  public displayedList = computed(() => {
    const allProjects = this.i18n.text().achievements.list;
    return this.showAll() ? allProjects : allProjects.slice(0, 3);
  });
  
  public hasMore = computed(() => {
    return this.i18n.text().achievements.list.length > 3;
  });
  
  public isShowingAll = computed(() => this.showAll());
  
  public toggleShowAll(): void {
    this.showAll.update(value => !value);
  }
}
