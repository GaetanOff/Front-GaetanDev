import {Component, OnInit} from '@angular/core';
import {I18nService} from "../../../../services/i18n/i18n.service";

@Component({
  selector: 'app-languages',
  templateUrl: '/languages.component.html',
  standalone: false
})
export class LanguagesComponent implements OnInit {

  constructor(public i18n: I18nService) {
  }

  ngOnInit(): void {
  }

}
