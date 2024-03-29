import {NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';

import {AppComponent} from './components/app.component';
import {NavbarComponent} from './components/include/navbar/navbar.component';
import {AppRoutingModule, routingComponents} from "./app-routing.module";
import {FormsModule} from "@angular/forms";
import {NotifierModule} from 'angular-notifier';
import {HttpClientModule} from "@angular/common/http";
import {FooterComponent} from './components/include/footer/footer.component';
import {CVComponent} from './components/include/cv/cv.component';
import {CertifComponent} from './components/include/cv/certif/certif.component';
import {ExperienceComponent} from './components/include/cv/experience/experience.component';
import {LanguagesComponent} from './components/include/cv/languages/languages.component';
import {CompetencesComponent} from "./components/include/cv/competences/competences.component";
import {ServicesComponent} from './components/include/services/services.component';
import { TempladminComponent } from './components/include/admin/templadmin/templadmin.component';

@NgModule({
  declarations: [
    routingComponents,
    AppComponent,
    NavbarComponent,
    FooterComponent,
    CertifComponent,
    ExperienceComponent,
    LanguagesComponent,
    CompetencesComponent,
    CVComponent,
    ServicesComponent,
    TempladminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NotifierModule
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
