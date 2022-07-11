import {Component, OnInit} from '@angular/core';
import {I18nService} from "../../../../services/i18n/i18n.service";

@Component({
  selector: 'app-certif',
  templateUrl: '/certif.component.html'
})
export class CertifComponent implements OnInit {
  certifList: any = [
    {
      name: 'AWS - Professional',
      date: this.i18n.isFrench ?
        "July 2020 - Today" :
        "Juillet 2020 - Aujourd'hui",
      description: this.i18n.isFrench ?
        "Two years of comprehensive experience designing, operating and troubleshooting solutions using the AWS Cloud" :
        "Deux ans d'expérience complète dans la conception l'exploitation et la résolution des problèmes des solutions en utilisant le Cloud AWS",
      active: true
    },
    {
      name: 'LPIC 1',
      date: this.i18n.isFrench ?
        'August 2018' :
        'Aout 2018',
      description: (this.i18n.isFrench ?
        'Obtaining certification' :
        'Obtention de la certification') + ' LPIC 1',
      active: false
    },
    {
      name: 'Certified Kubernetes Administrator',
      date: this.i18n.isFrench ?
        'October 2016' :
        'Octobre 2016',
      description: (this.i18n.isFrench ?
        'Obtaining certification' :
        'Obtention de la certification') + ' CKA',
      active: false
    }
  ];

  constructor(public i18n: I18nService) {
  }

  ngOnInit(): void {
  }

}
