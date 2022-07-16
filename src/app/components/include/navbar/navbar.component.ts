import {Component, OnInit} from '@angular/core';
import {DarkModeService} from "angular-dark-mode";
import {I18nService} from "../../../services/i18n/i18n.service";
import {LocalstorageService} from "../../../services/localstorage/localstorage.service";
import {Router} from "@angular/router";
import {NgxUiLoaderService} from "ngx-ui-loader";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  darkImg: string = "assets/img/moon.webp";
  languageImg: string = this.i18n.isFrench ? "assets/img/france.svg" : "assets/img/english.svg";
  darkClass: string = "bg-white";

  constructor(private darkModeService: DarkModeService, public i18n: I18nService, private localStorage: LocalstorageService,
              private router: Router, private ngxService: NgxUiLoaderService) {
  }

  ngOnInit(): void {
    this.switchDarkModeImage();

    let previous: number = 0;
    let previouses: boolean = false;
    let clicked: boolean = false;
    let clicked2: boolean = false;
    let clicked3: boolean = false;

    document.getElementById('nav-toggle')?.addEventListener("click", function () {
      ['animate__animated', 'animate__fadeInDown', 'sticky', 'top-0', 'z-50'].forEach(tokens => {
        document.getElementById("navHeader")?.classList.remove(tokens);
      });

      document.getElementById("nav-content")?.classList.toggle("hidden");

      ['animate__animated', 'animate__backInLeft'].forEach(tokens => {
        document.getElementById("nav-content")?.classList.add(tokens);
      });
    });

    document.getElementById('dark')?.addEventListener("click", function () {
      clicked2 = true;

      setTimeout(
        function () {
          clicked2 = false;
        }, 300);
    });

    document.addEventListener("click", function () {
      clicked2 = true;

      setTimeout(
        function () {
          clicked2 = false;
        }, 300);
    });

    document.addEventListener("scroll", function () {
      if (document.documentElement.scrollTop < previous) {
        if (!previouses && !clicked && !clicked2 && !clicked3) {
          previouses = true;

          ['animate__animated', 'animate__fadeInDown', 'sticky', 'top-0', 'z-50'].forEach(tokens => {
            document.getElementById("navHeader")?.classList.add(tokens);
          });

        }
      } else {
        if (!clicked && !clicked2 && !clicked3) {
          previouses = false;

          ['animate__animated', 'animate__fadeInDown', 'sticky', 'top-0', 'z-50'].forEach(tokens => {
            document.getElementById("navHeader")?.classList.remove(tokens);
          });

        }
      }

      previous = document.documentElement.scrollTop;
    });
  }

  disableMobileMenu(): void {
    if (!document.getElementById("nav-content")?.classList.contains("hidden")) {
      ['animate__animated', 'animate__backInLeft'].forEach(tokens => {
        document.getElementById("nav-content")?.classList.remove(tokens);
      });

      document.getElementById("nav-content")?.classList.toggle("hidden");
    }
  }

  onSwitchDarkMode(): void {
    this.darkModeService.toggle();
    this.switchDarkModeImage();
  }

  onSwitchLanguage(): void {
    this.switchLanguage();
  }

  onClickList(): void {
    window.scrollTo({top: 0});
  }

  switchDarkModeImage(): void {
    this.darkModeService.darkMode$.subscribe(bool => {
      if (bool) {
        this.darkImg = "assets/img/moon.webp";
        this.darkClass = "transitionMode bg-white";
      } else {
        this.darkImg = "assets/img/sun.webp";
        this.darkClass = "transitionMode bg-gray-custom";
      }
    })
  }

  switchLanguage(): void {
    this.ngxService.start();
    this.router.navigate([""]).then(() => console.log("Redirected to the main page"));

    const isFrench = this.i18n.isFrench as Boolean;

    if (isFrench) {
      this.i18n.isFrench = false;
      this.localStorage.get.setItem("english", "false")
      this.languageImg = "assets/img/english.svg";
    } else {
      this.i18n.isFrench = true;
      this.localStorage.get.setItem("english", "true")
      this.languageImg = "assets/img/france.svg";
    }

    setTimeout(() => {
      this.ngxService.stop();

      this.i18n.update();
    }, 200);
  }

}
