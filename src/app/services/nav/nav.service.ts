import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor() {
  }

  updateNav(current?: string): void {
    const pages = ['contact', 'real', 'about', 'accueil'];

    pages.forEach(page => {
      const element = document.getElementById(page) as HTMLElement | null;

      if (element) {
        element.classList.remove("font-bold");
        element.classList.add("font-medium");
      }
    });

    if (current) {
      const currentPageElement = document.getElementById(current) as HTMLElement | null;
      if (currentPageElement) {
        currentPageElement.classList.toggle("font-medium");
        currentPageElement.classList.toggle("font-bold");
      }
    }
  }


}
