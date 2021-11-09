import {Component, OnInit} from '@angular/core';
import {DarkModeService} from "angular-dark-mode";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  darkImg = "assets/img/moon.png";
  darkClass = "bg-white";

  constructor(private darkModeService: DarkModeService) {
  }


  ngOnInit(): void {
    this.image();

    let previous = 0;
    let previouses = false;
    let clicked = false;
    let clicked2 = false;
    let clicked3 = false;

    // @ts-ignore
    document.getElementById('nav-toggle').onclick = function () {
      clicked = !clicked;
      // @ts-ignore
      document.getElementById("nav-content").classList.toggle("hidden")
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
          console.log("" + document.documentElement.scrollTop + " " + previouses)
          previouses = true;

          // @ts-ignore
          document.getElementById("navHeader").classList.add("animate__animated")

          // @ts-ignore
          document.getElementById("navHeader").classList.add("fadeIn")

          // @ts-ignore
          document.getElementById("navHeader").classList.add("sticky")

          // @ts-ignore
          document.getElementById("navHeader").classList.add("top-0")

          // @ts-ignore
          document.getElementById("navHeader").classList.add("z-50")
        }
      } else {
        if (!clicked && !clicked2 && !clicked3) {
          previouses = false;

          // @ts-ignore
          document.getElementById("navHeader").classList.remove("animate__animated")

          // @ts-ignore
          document.getElementById("navHeader").classList.remove("fadeIn")

          // @ts-ignore
          document.getElementById("navHeader").classList.remove("sticky")

          // @ts-ignore
          document.getElementById("navHeader").classList.remove("top-0")

          // @ts-ignore
          document.getElementById("navHeader").classList.remove("z-50")

        }

        // do un-sticky
      }

      previous = document.documentElement.scrollTop;
    };

  }

  onToggle(): void {
    this.darkModeService.toggle();
    this.image();
  }

  onClickList(): void {
    window.scrollTo({top: 0});
  }

  image(): void {
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
