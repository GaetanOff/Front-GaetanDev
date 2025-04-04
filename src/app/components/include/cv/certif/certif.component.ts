import {Component, OnInit} from '@angular/core';
import {I18nService} from "../../../../services/i18n/i18n.service";

@Component({
  selector: 'app-certif',
  templateUrl: '/certif.component.html',
  standalone: false
})
export class CertifComponent implements OnInit {
  certifList: any = [];

  constructor(public i18n: I18nService) {
    this.updateText();
  }

  ngOnInit(): void {
    this.i18n.updateEvent.subscribe((): void => {
      this.updateText();
    });
  }

  private updateText(): void {
    this.certifList = [
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
      }
    ];
  }

}
