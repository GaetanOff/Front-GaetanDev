import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor() { }

  updateNav(): void {
    // @ts-ignore
    if (document.getElementById("contact").classList.contains("font-bold")) {
      // @ts-ignore
      document.getElementById("contact").classList.toggle("font-bold");
    }

    // @ts-ignore
    if (document.getElementById("real").classList.contains("font-bold")) {
      // @ts-ignore
      document.getElementById("real").classList.toggle("font-bold");
    }

    // @ts-ignore
    if (document.getElementById("about").classList.contains("font-bold")) {
      // @ts-ignore
      document.getElementById("about").classList.toggle("font-bold");
    }

    // @ts-ignore
    if (document.getElementById("accueil").classList.contains("font-bold")) {
      // @ts-ignore
      document.getElementById("accueil").classList.toggle("font-bold");
    }

    // @ts-ignore
    if (document.getElementById("blog").classList.contains("font-bold")) {
      // @ts-ignore
      document.getElementById("blog").classList.toggle("font-bold");
    }
  }
}
