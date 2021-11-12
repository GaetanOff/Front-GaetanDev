import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-experience',
  templateUrl: '/experience.component.html'
})
export class ExperienceComponent implements OnInit {
  experiencesList = [
    {
      name: 'Free-lance',
      date: "Octobre 2016 - Aujourd'hui",
      description: "Développeur FullStack & DevOps",
      active: true
    },
    {
      name: 'EspritGames',
      date: 'Juin 2021',
      description: 'Administrateur systèmes',
      active: false
    },
    {
      name: 'Ubisoft',
      date: 'Janvier 2019',
      description: 'Stage: Architecte logiciel & DevOps',
      active: false
    },
    {
      name: 'Université de Montpellier',
      date: 'Janvier 2017 / Janvier 2018',
      description: 'Stage: Architecte logiciel & DevOps',
      active: false
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
