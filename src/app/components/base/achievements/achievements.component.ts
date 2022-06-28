import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NavService} from "../../../services/nav/nav.service";
import {I18nService} from "../../../services/i18n/i18n.service";

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html'
})
export class AchievementsComponent implements OnInit {
  achievementsList = [
    {
      name: 'Content Delivery Network',
      description: this.i18n.isFrench ? "My content distribution network to be able to have a fast and reliable distribution." : "Mon réseau de distribution de contenu pour pouvoir avoir une diffusion rapides et fiables.",
      image: 'assets/img/achievements/cdn.webp',
      redirect: 'https://cdn.gaetandev.fr/'
    }
  ];

  constructor(private titleService: Title, private navService: NavService, public i18n: I18nService) {
  }

  ngOnInit(): void {
    this.navService.updateNav();

    document.getElementById("real")?.classList.toggle("font-bold");

    this.titleService.setTitle("Gaetan • " + (this.i18n.isFrench ? "Achievements" : "Réalisations"));
  }

}
