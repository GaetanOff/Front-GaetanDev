import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { I18nService } from "../../../../services/i18n/i18n.service";

@Component({
  selector: 'app-cgv',
  templateUrl: './cgv.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CgvComponent implements OnInit {
  public i18n = inject(I18nService);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle("Gaetan • " + this.i18n.text().title.cgv);
  }
}
