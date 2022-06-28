import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <notifier-container></notifier-container>

    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
export class AppComponent {
  title = 'Front-GaetanDev';
}
