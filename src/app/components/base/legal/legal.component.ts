import {Component, OnInit} from '@angular/core';
import {NavService} from "../../../services/nav/nav.service";
import {I18nService} from "../../../services/i18n/i18n.service";

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html'
})
export class LegalComponent implements OnInit {

  constructor(private navService: NavService, public i18n: I18nService) {
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.navService.updateNav();
  }

}
