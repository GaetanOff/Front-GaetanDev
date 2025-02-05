import {Component, OnInit} from '@angular/core';
import {I18nService} from "../../../services/i18n/i18n.service";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    standalone: false
})
export class FooterComponent implements OnInit {

  constructor(public i18n: I18nService) {
  }

  ngOnInit(): void {
  }

}
