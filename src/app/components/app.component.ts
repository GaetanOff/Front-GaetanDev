import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <ngx-sonner-toaster position="bottom-left" richColors />

    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  standalone: false
})
export class AppComponent {
  title = 'Front-GaetanDev';
}
