import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import {I18nService} from "../../../../services/i18n/i18n.service";

@Component({
  selector: 'app-certif',
  templateUrl: './certif.component.html',
  styleUrl: './certif.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertifComponent {
  public i18n = inject(I18nService);

  public certifList = computed(() => [
    {
      name: 'AWS - Professional',
      date: this.i18n.isEnglish() ? "July 2020 - Today" : "Juillet 2020 - Aujourd'hui",
      description: this.i18n.isEnglish() ? "Two years of comprehensive experience designing, operating and troubleshooting solutions using the AWS Cloud" : "Deux ans d'expérience complète dans la conception l'exploitation et la résolution des problèmes des solutions en utilisant le Cloud AWS",
      active: true
    },
    {
      name: 'LPIC 1',
      date: this.i18n.isEnglish() ? 'August 2018' : 'Août 2018',
      description: (this.i18n.isEnglish() ? 'Obtaining certification' : 'Obtention de la certification') + ' LPIC 1',
      active: false
    }
  ]);
}
