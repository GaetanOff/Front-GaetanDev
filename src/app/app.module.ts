import {NgModule} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";

@NgModule({
  providers: [
    Title,
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule {
}
