import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NavbarComponent} from './components/include/navbar/navbar.component';
import {AppRoutingModule, routingComponents} from "./app-routing.module";
import {FormsModule} from "@angular/forms";
import {RECAPTCHA_SETTINGS, RecaptchaModule, RecaptchaSettings} from "ng-recaptcha";
import {NotifierModule} from 'angular-notifier';
import {HttpClientModule} from "@angular/common/http";
import {FooterComponent} from './components/include/footer/footer.component';
import {WhymeComponent} from './components/include/whyme/whyme.component';
import {CVComponent} from './components/include/cv/cv.component';
import {CertifComponent} from './components/include/cv/certif/certif.component';
import {ExperienceComponent} from './components/include/cv/experience/experience.component';
import {LanguagesComponent} from './components/include/cv/languages/languages.component';
import {CompetencesComponent} from "./components/include/cv/competences/competences.component";
import {ServicesComponent} from './components/include/services/services.component';


@NgModule({
  declarations: [
    routingComponents,
    AppComponent,
    NavbarComponent,
    FooterComponent,
    WhymeComponent,
    CVComponent,
    CertifComponent,
    ExperienceComponent,
    LanguagesComponent,
    CompetencesComponent,
    ServicesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RecaptchaModule,
    NotifierModule,
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {siteKey: "6LflFpcbAAAAAHVzsHtIZtJHqpKqxdWNKpMH3Bmo"} as RecaptchaSettings,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
