import {Component, OnInit} from '@angular/core';
import {I18nService} from "../../../../services/i18n/i18n.service";

@Component({
  selector: 'app-experience',
  templateUrl: '/experience.component.html'
})
export class ExperienceComponent implements OnInit {
  experiencesList: any = [
    {
      name: 'Free-lance',
      date: this.i18n.isFrench ?
        "October 2016 - Today" :
        "Octobre 2016 - Aujourd'hui",
      description: this.i18n.isFrench ?
        "Full-Stack Developer & DevOps" :
        "Développeur Full-Stack & DevOps",
      active: true
    },
    {
      name: 'Ubisoft',
      date: this.i18n.isFrench ?
        'January 2019' :
        'Janvier 2019',
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

  constructor(public i18n: I18nService) {
  }

  ngOnInit(): void {
  }

}
