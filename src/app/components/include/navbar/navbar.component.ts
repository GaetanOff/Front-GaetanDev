import {Component, OnInit} from '@angular/core';
import {DarkModeService} from "angular-dark-mode";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  darkImg = "assets/img/moon.png";
  darkClass = "bg-white";

  constructor(private darkModeService: DarkModeService) {
  }


  ngOnInit(): void {
    this.switchDarkModeImage();

    let previous = 0;
    let previouses = false;
    let clicked = false;
    let clicked2 = false;
    let clicked3 = false;

    // @ts-ignore
    document.getElementById('nav-toggle').onclick = function () {
      clicked = !clicked;
      // @ts-ignore
      document.getElementById("nav-content").classList.toggle("hidden");
    }

    // @ts-ignore
    document.getElementById('dark').onclick = function () {
      clicked2 = true;

      setTimeout(
        function () {
          clicked2 = false;
        }, 300);
    }

    window.onscroll = function () {

      if (document.documentElement.scrollTop < previous) {
        if (!previouses && !clicked && !clicked2 && !clicked3) {
          previouses = true;

          ['animate__animated', 'animate__fadeInDown', 'sticky', 'top-0', 'z-50'].forEach(tokens => {
            // @ts-ignore
            document.getElementById("navHeader").classList.add(tokens);
          });

        }
      } else {
        if (!clicked && !clicked2 && !clicked3) {
          previouses = false;

          ['animate__animated', 'animate__fadeInDown', 'sticky', 'top-0', 'z-50'].forEach(tokens => {
            // @ts-ignore
            document.getElementById("navHeader").classList.remove(tokens);
          });

        }
      }

      previous = document.documentElement.scrollTop;
    };

  }

  onSwitchDarkMode(): void {
    this.darkModeService.toggle();
    this.switchDarkModeImage();
  }

  onClickList(): void {
    window.scrollTo({top: 0});
  }

  switchDarkModeImage(): void {
    this.darkModeService.darkMode$.subscribe(bool => {
      if (bool) {
        this.darkImg = "assets/img/moon.png";
        this.darkClass = "transitionMode bg-white";
      } else {
        this.darkImg = "assets/img/sun.png";
        this.darkClass = "transitionMode black";
      }
    })
  }

}
