import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {I18nService} from "../../../services/i18n/i18n.service";

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalComponent {
  public i18n = inject(I18nService);
}
