import {Component, OnInit} from '@angular/core';
import {DarkModeService} from "angular-dark-mode";

function changeLang(boolean: any) {
  if (boolean) {

  } else {

  }
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  darkMode$ = this.darkModeService.darkMode$;
  darkImg = "assets/img/moon.png";

  constructor(private darkModeService: DarkModeService) {
  }

  ngOnInit(): void {
    this.image();

    // @ts-ignore
    document.getElementById('nav-toggle').onclick = function () {
      // @ts-ignore
      document.getElementById("nav-content").classList.toggle("hidden");
    }
  }

  onToggle(): void {
    this.darkModeService.toggle();
    this.image();
  }

  image(): void {
    this.darkModeService.darkMode$.subscribe(bool => {
      if (bool) {
        this.darkImg = "assets/img/moon.png";
      } else {
        this.darkImg = "assets/img/sun.png";
      }
    })
  }
}
