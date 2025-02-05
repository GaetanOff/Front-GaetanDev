import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NavService} from "../../../services/nav/nav.service";
import {I18nService} from "../../../services/i18n/i18n.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {

  constructor(private titleService: Title, private navService: NavService, public i18n: I18nService) {
  }

  ngOnInit(): void {
    this.navService.updateNav("accueil");

    this.titleService.setTitle("Gaetan • DevOps");
  }

}
