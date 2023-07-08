import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NavService} from "../../../services/nav/nav.service";
import {I18nService} from "../../../services/i18n/i18n.service";
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {

  constructor(private titleService: Title, private notifierService: NotifierService, private navService: NavService, public i18n: I18nService) {
  }

  ngOnInit(): void {
    this.navService.updateNav("about");

    this.titleService.setTitle("Gaetan • " + this.i18n.text.title.about);
  }

  processForm() {
    this.notifierService.notify('error', this.i18n.text.about.cvNotAvailable);
  }

}
