import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NavService} from "../../../services/nav/nav.service";
import {I18nService} from "../../../services/i18n/i18n.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {

  constructor(private titleService: Title, private navService: NavService, public i18n: I18nService) {
  }

  ngOnInit(): void {
    this.navService.updateNav();

    document.getElementById("about")?.classList.toggle("font-bold");

    this.titleService.setTitle("Gaetan • " + (this.i18n.isFrench ? "About me" : "A propos"));
  }

  processForm() {
    console.log("Ca arrive !");
  }

}
