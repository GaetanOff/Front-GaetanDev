import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AboutComponent} from "./about.component";
import {CVComponent} from "../../include/cv/cv.component";
import {CertifComponent} from "../../include/cv/certif/certif.component";
import {ExperienceComponent} from "../../include/cv/experience/experience.component";
import {LanguagesComponent} from "../../include/cv/languages/languages.component";
import {CompetencesComponent} from "../../include/cv/competences/competences.component";
import {ServicesComponent} from "../../include/services/services.component";

const routes: Routes = [
  {
    path: '',
    component: AboutComponent
  },
]

@NgModule({
  declarations: [
    CVComponent,
    CertifComponent,
    ExperienceComponent,
    LanguagesComponent,
    CompetencesComponent,
    ServicesComponent
  ],
  exports: [
    CVComponent,
    ServicesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class AboutModule { }
