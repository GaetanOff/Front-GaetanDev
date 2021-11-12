import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-certif',
  templateUrl: '/certif.component.html'
})
export class CertifComponent implements OnInit {
  certifList = [
    {
      name: 'AWS - Professional',
      date: "Juillet 2020 - Aujourd'hui",
      description: "Deux ans d'expérience complète dans la conception l'exploitation " +
        "et la résolution des problèmes des solutions en utilisant le Cloud AWS",
      active: true
    },
    {
      name: 'LPIC 1',
      date: 'Aout 2018',
      description: 'Obtention de la certification LPIC 1',
      active: false
    },
    {
      name: 'Certified Kubernetes Administrator',
      date: 'Octobre 2016',
      description: 'Obtention de la certification CKA',
      active: false
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
