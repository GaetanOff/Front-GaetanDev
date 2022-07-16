import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <notifier-container></notifier-container>
    <ngx-ui-loader fgsColor="#18a44c" pbColor="#18a44c" [hasProgressBar]=false></ngx-ui-loader>

    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
export class AppComponent {
  title = 'Front-GaetanDev';
}
