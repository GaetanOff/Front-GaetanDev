import {Component, OnInit} from '@angular/core';
import {DarkModeService} from "angular-dark-mode";
import {I18nService} from "../../../services/i18n/i18n.service";
import {LocalstorageService} from "../../../services/localstorage/localstorage.service";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [`
    @media all and (min-width: 1027px) {
      .darkModeDesk {
        display: block;
      }
    }

    @media all and (max-width: 1026px) {
      .darkModeDesk {
        display: none;
      }
    }

    .font-bold {
      font-weight: 700;
    }

    .bg-gray-custom {
      --tw-bg-opacity: 1;
      background-color: #2d3436;
    }

    .bg-white {
      --tw-bg-opacity: 1;
      background-color: white;
    }

    .sticky {
      position: -webkit-sticky;
      position: sticky
    }
  `]
})
export class NavbarComponent implements OnInit {
  darkImg = "assets/img/moon.webp";
  languageImg = this.i18n.isFrench ? "assets/img/france.svg" : "assets/img/english.svg";
  darkClass = "bg-white";

  constructor(private darkModeService: DarkModeService, public i18n: I18nService, private localStorage: LocalstorageService,
              private router: Router, private notifierService: NotifierService) {
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
      ['animate__animated', 'animate__fadeInDown', 'sticky', 'top-0', 'z-50'].forEach(tokens => {
        // @ts-ignore
        document.getElementById("navHeader").classList.remove(tokens);
      });

      // @ts-ignore
      document.getElementById("nav-content").classList.toggle("hidden");

      ['animate__animated', 'animate__backInLeft'].forEach(tokens => {
        // @ts-ignore
        document.getElementById("nav-content").classList.add(tokens);
      });
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

  disableMobileMenu(): void {
    // @ts-ignore
    if (!document.getElementById("nav-content").classList.contains("hidden")) {
      ['animate__animated', 'animate__backInLeft'].forEach(tokens => {
        // @ts-ignore
        document.getElementById("nav-content").classList.remove(tokens);
      });

      // @ts-ignore
      document.getElementById("nav-content").classList.toggle("hidden");
    }
  }

  onSwitchDarkMode(): void {
    this.darkModeService.toggle();
    this.switchDarkModeImage();
  }

  onSwitchLanguage(): void {
    this.switchDarkLanguage();
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

  switchDarkLanguage(): void {
    if (this.i18n.isFrench) {
      this.i18n.isFrench = false;
      this.localStorage.get.setItem("english", "false")
      this.languageImg = "assets/img/english.svg";
      this.notifierService.notify('success', "Succès, vous êtes maintenant sur la version française.");
    } else {
      this.i18n.isFrench = true;
      this.localStorage.get.setItem("english", "true")
      this.languageImg = "assets/img/france.svg";
      this.notifierService.notify('success', "Success, you are now on the English version.");
    }

    this.i18n.update();
    this.router.navigate([" "]).then(() => console.log("Redirected to the main page"));
  }

}
