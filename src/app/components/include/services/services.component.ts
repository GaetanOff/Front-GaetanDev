import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {I18nService} from "../../../services/i18n/i18n.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink
  ]
})
export class ServicesComponent {
  public i18n = inject(I18nService);
}
