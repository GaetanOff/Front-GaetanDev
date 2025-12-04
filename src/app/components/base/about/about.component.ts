
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
export class AboutComponent implements OnInit {
  public i18n = inject(I18nService);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle("Gaetan • " + this.i18n.text().title.about);
  }

  processForm(): void {
    toast.error(this.i18n.text().about.cvNotAvailable);
  }
}
