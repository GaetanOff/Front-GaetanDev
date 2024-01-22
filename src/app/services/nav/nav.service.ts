import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  isAdminNavOpened: boolean = true;

  constructor() {
  }

  updateNav(current?: string): void {
    const pages: string[] = ['contact', 'real', 'about', 'accueil'];

    pages.forEach((page: string): void => {
      const element: HTMLElement | null = document.getElementById(page);

      if (element) {
        element.classList.remove("font-bold");
        element.classList.add("font-medium");
      }
    });

    if (current) {
      const currentPageElement: HTMLElement | null = document.getElementById(current);
      if (currentPageElement) {
        currentPageElement.classList.toggle("font-medium");
        currentPageElement.classList.toggle("font-bold");
      }
    }
  }


}
