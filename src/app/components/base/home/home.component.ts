import { Component, ChangeDetectionStrategy, inject, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {I18nService} from "../../../services/i18n/i18n.service";
import { LocalerouteService } from 'src/app/services/route/localeroute.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  public i18n = inject(I18nService);
  public localeRoute = inject(LocalerouteService);
  private titleService = inject(Title);
  public currentLang = computed(() => this.i18n.isEnglish() ? 'en' : 'fr');

  ngOnInit(): void {
    this.titleService.setTitle("Gaetan • DevOps & Développeur Fullstack | IA & MLOps");
  }
}
