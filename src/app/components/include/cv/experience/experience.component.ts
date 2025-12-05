import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import {I18nService} from "../../../../services/i18n/i18n.service";

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
  public i18n = inject(I18nService);

  public experiencesList = computed(() => [
      {
        name: 'Freelance',
        date: this.i18n.isEnglish() ? "October 2021 - Today" : "Octobre 2021 - Aujourd'hui",
        description: this.i18n.isEnglish() ? "Full-Stack Developer & DevOps | AI & MLOps" : "Développeur Full-Stack & DevOps | IA & MLOps",
        active: true
      },
      {
        name: 'FirstSky / PixelmonGo',
        date: this.i18n.isEnglish() ? "September 2021 - September 2024" : "Septembre 2021 - Septembre 2024",
        description: this.i18n.isEnglish() ? 'Management of all server infrastructure' : "Gestion de l'infrastructure de l'ensemble des serveurs",
        active: false
      },
      {
        name: 'JobMe',
        date: this.i18n.isEnglish() ? 'May 2023 - August 2023' : 'Mai 2023 - Août 2023',
        description: this.i18n.isEnglish() ? "Full-Stack Developer & DevOps" : "Développeur Full-Stack & DevOps",
        active: false
      },
      {
        name: 'Ubisoft',
        date: this.i18n.isEnglish() ? 'January 2020 - January 2020' : 'Janvier 2020 - Janvier 2020',
        description: this.i18n.isEnglish() ? 'Internship: Software Architect & DevOps' : 'Stage: Architecte logiciel & DevOps',
        active: false
      },
      {
        name: 'Université de Montpellier',
        date: this.i18n.isEnglish() ? 'January 2019 - January 2020' : 'Janvier 2019 - Janvier 2020',
        description: this.i18n.isEnglish() ? 'Internship: Software Architect & DevOps' : 'Stage: Architecte logiciel & DevOps',
        active: false
      },
      {
        name: 'Université de Montpellier',
        date: this.i18n.isEnglish() ? 'January 2017 - January 2018' : 'Janvier 2017 - Janvier 2018',
        description: this.i18n.isEnglish() ? 'Internship: Software Architect & DevOps' : 'Stage: Architecte logiciel & DevOps',
        active: false
      }
    ]
  );

  public calculateDuration(dateRange: string): string {
    const texts = this.i18n.text().cv;
    const isEnglish = this.i18n.isEnglish();

    let [startDate, endDate]: string[] = dateRange.split(" - ");
    startDate = startDate.trim();
    endDate = endDate ? endDate.trim() : texts.today;

    const start: Date = this.parseDate(startDate);
    const end: Date = (endDate === texts.today) ? new Date() : this.parseDate(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return texts.unknownDuration;
    }

    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();
    const totalMonths = months <= 0 ? 0 : months;

    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;

    if (years === 0 && remainingMonths <= 1) {
      return texts.lessThanMonth;
    }

    let durationParts = [];
    if (years > 0) {
      durationParts.push(`${years} ${years > 1 ? texts.years : texts.year}`);
    }
    if (remainingMonths > 0) {
      durationParts.push(`${remainingMonths} ${remainingMonths > 1 ? texts.months : texts.month}`);
    }
    return durationParts.join(` ${texts.and} `);
  }

  private parseDate(dateStr: string): Date {
    const monthsFR: { [key: string]: number } = { "janvier": 0, "février": 1, "mars": 2, "avril": 3, "mai": 4, "juin": 5, "juillet": 6, "août": 7, "septembre": 8, "octobre": 9, "novembre": 10, "décembre": 11 };
    const monthsEN: { [key: string]: number } = { "january": 0, "february": 1, "march": 2, "april": 3, "may": 4, "june": 5, "july": 6, "august": 7, "september": 8, "october": 9, "november": 10, "december": 11 };

    const months = this.i18n.isEnglish() ? monthsEN : monthsFR;
    const parts = dateStr.toLowerCase().split(" ");

    if (parts.length === 2) {
      const month = months[parts[0]];
      const year = parseInt(parts[1], 10);
      if (!isNaN(year) && month !== undefined) {
        return new Date(year, month);
      }
    }
    return new Date('invalid'); // Return invalid date if parsing fails
  }
}
