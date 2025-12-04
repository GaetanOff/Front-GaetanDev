
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {ServicesComponent} from "../../include/services/services.component";
import {CompetencesComponent} from "../../include/cv/competences/competences.component";
import {ExperienceComponent} from "../../include/cv/experience/experience.component";
import {CertifComponent} from "../../include/cv/certif/certif.component";
import {LanguagesComponent} from "../../include/cv/languages/languages.component";
import {I18nService} from "../../../services/i18n/i18n.service";
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  imports: [
    ServicesComponent,
    CompetencesComponent,
    ExperienceComponent,
    CertifComponent,
    LanguagesComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  public i18n = inject(I18nService);

  processForm(): void {
    toast.error(this.i18n.text().about.cvNotAvailable);
  }
}
