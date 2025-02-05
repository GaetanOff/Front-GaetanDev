import {Component, OnInit} from '@angular/core';
import {I18nService} from "../../../../services/i18n/i18n.service";

@Component({
  selector: 'app-experience',
  templateUrl: '/experience.component.html',
  standalone: false
})
export class ExperienceComponent implements OnInit {
  experiencesList: any = [];

  constructor(public i18n: I18nService) {
    this.updateText();
  }

  ngOnInit(): void {
    this.i18n.updateEvent.subscribe((): void => {
      this.updateText();
    });
  }

  public calculateDuration(dateRange: string): string {
    let [startDate, endDate]: string[] = dateRange.includes(" / ")
      ? dateRange.split(" / ")
      : dateRange.split(" - ");

    startDate = startDate.trim();
    endDate = endDate ? endDate.trim() : (this.i18n.isFrench ? "Aujourd'hui" : "Today");

    const start: Date = this.parseDate(startDate);
    const end: Date = endDate.includes("Aujourd'hui") || endDate.includes("Today") ? new Date() : this.parseDate(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return this.i18n.isFrench ? "Durée inconnue" : "Unknown duration";
    }

    const years: number = end.getFullYear() - start.getFullYear();
    const months: number = end.getMonth() - start.getMonth();

    const totalMonths: number = years * 12 + months;

    const formattedYears: number = Math.floor(totalMonths / 12);
    const formattedMonths: number = totalMonths % 12;

    if (formattedYears === 0 && formattedMonths === 0) {
      return !this.i18n.isFrench ? "Moins d'un mois" : "Less than a month";
    }

    if (!this.i18n.isFrench) {
      if (formattedYears > 0 && formattedMonths > 0) {
        return `${formattedYears} an${formattedYears > 1 ? 's' : ''} et ${formattedMonths} mois`;
      } else if (formattedYears > 0) {
        return `${formattedYears} an${formattedYears > 1 ? 's' : ''}`;
      } else {
        return `${formattedMonths} mois`;
      }
    } else {
      if (formattedYears > 0 && formattedMonths > 0) {
        return `${formattedYears} year${formattedYears > 1 ? 's' : ''} and ${formattedMonths} month${formattedMonths > 1 ? 's' : ''}`;
      } else if (formattedYears > 0) {
        return `${formattedYears} year${formattedYears > 1 ? 's' : ''}`;
      } else {
        return `${formattedMonths} month${formattedMonths > 1 ? 's' : ''}`;
      }
    }
  }

  private updateText(): void {
    this.experiencesList = [
      {
        name: 'Freelance',
        date: this.i18n.isFrench ?
          "October 2021 - Today" :
          "Octobre 2021 - Aujourd'hui",
        description: this.i18n.isFrench ?
          "Full-Stack Developer & DevOps" :
          "Développeur Full-Stack & DevOps",
        active: true
      },
      {
        name: 'FirstSky / PixelmonGo',
        date: this.i18n.isFrench ?
          "September 2021 - Today" :
          "Septembre 2021 - Aujourd'hui",
        description: this.i18n.isFrench ?
          'Management of all server infrastructure' :
          "Gestion de l'infrastructure de l'ensemble des serveurs",
        active: true
      },
      {
        name: 'JobMe',
        date: this.i18n.isFrench ?
          'May 2023 / August 2023' :
          'Mai 2023 / Août 2023',
        description: this.i18n.isFrench ?
          "Full-Stack Developer & DevOps" :
          "Développeur Full-Stack & DevOps",
        active: false
      },
      {
        name: 'Ubisoft',
        date: this.i18n.isFrench ?
          'January 2020 / January 2020' :
          'Janvier 2020 / Janvier 2020',
        description: this.i18n.isFrench ?
          'Internship: Software Architect & DevOps' :
          'Stage: Architecte logiciel & DevOps',
        active: false
      },
      {
        name: 'Université de Montpellier',
        date: this.i18n.isFrench ?
          'January 2019 / January 2020' :
          'Janvier 2019 / Janvier 2020',
        description: this.i18n.isFrench ?
          'Internship: Software Architect & DevOps' :
          'Stage: Architecte logiciel & DevOps',
        active: false
      },
      {
        name: 'Université de Montpellier',
        date: this.i18n.isFrench ?
          'January 2017 / January 2018' :
          'Janvier 2017 / Janvier 2018',
        description: this.i18n.isFrench ?
          'Internship: Software Architect & DevOps' :
          'Stage: Architecte logiciel & DevOps',
        active: false
      }
    ];
  }

  private parseDate(dateStr: string): Date {
    const monthsFR: { [key: string]: number } = {
      "Janvier": 0, "Février": 1, "Mars": 2, "Avril": 3, "Mai": 4, "Juin": 5,
      "Juillet": 6, "Août": 7, "Septembre": 8, "Octobre": 9, "Novembre": 10, "Décembre": 11
    };

    const monthsEN: { [key: string]: number } = {
      "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5,
      "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
    };

    const months: any = this.i18n.isFrench ? monthsEN : monthsFR;
    const parts: string[] = dateStr.split(" ");

    if (parts.length === 2) {
      const month: number = months[parts[0]];
      const year: number = parseInt(parts[1]);
      if (!isNaN(year) && month !== undefined) {
        return new Date(year, month);
      }
    }

    return new Date();
  }
}
