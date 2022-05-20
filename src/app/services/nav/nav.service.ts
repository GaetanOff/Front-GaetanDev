import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor() {
  }

  updateNav(): void {
    ['contact', 'real', 'about', 'accueil'].forEach(page => {
      // @ts-ignore
      if (document.getElementById(page).classList.contains("font-bold")) {
        // @ts-ignore
        document.getElementById(page).classList.toggle("font-bold");
      }
    });
  }

}
