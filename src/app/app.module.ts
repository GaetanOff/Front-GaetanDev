import {NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';

import {AppComponent} from './components/app.component';
import {AppRoutingModule, routingComponents} from "./app-routing.module";
import {FormsModule} from "@angular/forms";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {CertifComponent} from './components/include/cv/certif/certif.component';
import {ExperienceComponent} from './components/include/cv/experience/experience.component';
import {LanguagesComponent} from './components/include/cv/languages/languages.component';
import {CompetencesComponent} from "./components/include/cv/competences/competences.component";
import {ServicesComponent} from './components/include/services/services.component';
import {NgxSonnerToaster} from "ngx-sonner";
import {NgxTurnstileModule} from "ngx-turnstile";
import {
  WhitelistedIpsSkeletonsComponent
} from "./components/include/skeletons/whitelisted-ips-skeletons/whitelisted-ips-skeletons.component";
import {
  RemoveIpSkeletonsComponent
} from "./components/include/skeletons/remove-ip-skeletons/remove-ip-skeletons.component";
import {AddIpSkeletonsComponent} from "./components/include/skeletons/add-ip-skeletons/add-ip-skeletons.component";
import {
  CorrectorTextSkeletonsComponent
} from "./components/include/skeletons/corrector-text-skeletons/corrector-text-skeletons.component";
import {ErrorComponent} from "./components/base/error/error.component";
import {AuthComponent} from "./components/base/admin/auth/auth.component";

@NgModule({
  declarations: [
    AuthComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    routingComponents,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxSonnerToaster,
    NgxTurnstileModule,
    AppComponent,
    CertifComponent,
    ExperienceComponent,
    LanguagesComponent,
    CompetencesComponent,
    ServicesComponent,
    ErrorComponent,
  ],
  providers: [
    Title,
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule {
}
