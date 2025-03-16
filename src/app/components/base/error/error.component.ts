import { Component } from '@angular/core';
import {I18nService} from "../../../services/i18n/i18n.service";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  standalone: false
})
export class ErrorComponent {
  constructor(public i18n: I18nService) {
  }

}
