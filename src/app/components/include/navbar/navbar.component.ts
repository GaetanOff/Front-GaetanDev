import {Component, OnInit} from '@angular/core';
import {I18nService} from "../../../services/i18n/i18n.service";
import {LocalstorageService} from "../../../services/localstorage/localstorage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  languageImg: string = this.i18n.isFrench ? "assets/img/france.svg" : "assets/img/english.svg";

  constructor(public i18n: I18nService, private localStorage: LocalstorageService,
              private router: Router) {
  }

  ngOnInit(): void {
    let previous: number = 0;
    let previouses: boolean = false;
    let clicked: boolean = false;
    let clicked2: boolean = false;
    let clicked3: boolean = false;

    document.getElementById('nav-toggle')?.addEventListener("click", () => {
      ['animate__animated', 'animate__fadeInDown', 'sticky', 'top-0', 'z-50'].forEach(tokens => {
        document.getElementById("navHeader")?.classList.remove(tokens);
      });

      document.getElementById("nav-content")?.classList.toggle("hidden");

      ['animate__animated', 'animate__backInLeft'].forEach(tokens => {
        document.getElementById("nav-content")?.classList.add(tokens);
      });
    });

    document.addEventListener("click", () => {
      clicked2 = true;

      setTimeout(() => {
        clicked2 = false;
      }, 300);
    });

    document.addEventListener("scroll", () => {
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
    const navContent = document.getElementById("nav-content");
    if (navContent && !navContent.classList.contains("hidden")) {
      ['animate__animated', 'animate__backInLeft'].forEach(tokens => {
        navContent.classList.remove(tokens);
      });

      navContent.classList.toggle("hidden");
    }
  }


  onSwitchLanguage(): void {
    this.switchLanguage();
  }

  onClickList(): void {
    window.scrollTo({top: 0});
  }

  switchLanguage(): void {
    if (!window.location.href.indexOf("/shield"))
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

    this.i18n.update();
  }

}
