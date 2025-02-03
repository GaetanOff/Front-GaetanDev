import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NavService} from "../../../services/nav/nav.service";
import {I18nService} from "../../../services/i18n/i18n.service";
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
  protected readonly toast = toast;

  constructor(private titleService: Title, private navService: NavService, public i18n: I18nService) {
  }

  ngOnInit(): void {
    this.navService.updateNav("about");

    this.titleService.setTitle("Gaetan • " + this.i18n.text.title.about);
  }

  processForm(): void {
    this.toast.error(this.i18n.text.about.cvNotAvailable);
  }

}
