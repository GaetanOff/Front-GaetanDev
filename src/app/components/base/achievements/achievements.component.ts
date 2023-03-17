import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NavService} from "../../../services/nav/nav.service";
import {I18nService} from "../../../services/i18n/i18n.service";

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html'
})
export class AchievementsComponent implements OnInit {
  achievementsList: any = [];
  showedList: any = [];

  constructor(private titleService: Title, private navService: NavService, public i18n: I18nService) {
    this.updateText();
  }

  ngOnInit(): void {
    this.navService.updateNav();

    document.getElementById("real")?.classList.toggle("font-medium");
    document.getElementById("real")?.classList.toggle("font-bold");

    this.titleService.setTitle("Gaetan • " + (this.i18n.isFrench ? "Achievements" : "Réalisations"));

    this.i18n.updateEvent.subscribe(() => {
      this.updateText();
    });
  }

  private updateText(): void {
    this.achievementsList = [
      {
        name: 'Content Delivery Network',
        description: this.i18n.text.achievements.cdn,
        image: 'assets/img/achievements/cdn.webp',
        redirect: 'https://cdn.gaetandev.fr/'
      },
      {
        name: 'ImmoCT',
        description: this.i18n.text.achievements.immoct,
        image: 'assets/img/achievements/immoct.webp',
        redirect: 'https://www.immoct.fr/'
      },
      {
        name: 'PizzaOPlomo',
        description: this.i18n.text.achievements.pizzaoplomo,
        image: 'assets/img/achievements/pizzaoplomo.webp',
        redirect: 'https://www.pizzaoplomo.gaetandev.fr/'
      },
      {
        name: 'PixelmonGo',
        description: this.i18n.text.achievements.firstsky,
        image: 'assets/img/achievements/pixelmongo.webp',
        redirect: 'https://pixelmongo.fr/'
      },
      {
        name: 'FirstSky',
        description: this.i18n.text.achievements.firstsky,
        image: 'assets/img/achievements/firstsky.webp',
        redirect: 'https://firstsky.net/'
      },
      {
        name: 'Hôtel Neptune',
        description: this.i18n.text.achievements.neptune,
        image: 'assets/img/achievements/neptune.webp',
        redirect: 'https://github.com/Projet-Hotel-Neptune-GLJQR/Application'
      },
      {
        name: 'FoxFood',
        description: this.i18n.text.achievements.pizzaoplomo,
        image: 'assets/img/achievements/foxfood.svg',
        redirect: 'https://github.com/Fox-Food'
      },
      {
        name: 'CT-Energetique',
        description: this.i18n.text.achievements.ctenergetique,
        image: 'assets/img/achievements/ctenergetique.webp',
        redirect: 'https://www.ct-energetique.fr/'
      },
      {
        name: 'HeavyCloud',
        description: this.i18n.text.achievements.heavycloud,
        image: 'assets/img/achievements/heavycloud.webp',
        redirect: ''
      },
      {
        name: 'ChloeCM',
        description: this.i18n.text.achievements.chloecm,
        image: 'assets/img/achievements/chloecm.webp',
        redirect: 'https://www.chloecm.fr/'
      },
      {
        name: 'VitaPot',
        description: this.i18n.text.achievements.vitapot,
        image: 'assets/img/achievements/VitaPot.webp',
        redirect: 'https://twitter.com/vitapot'
      }
    ];

    this.showedList = this.achievementsList.slice(0, 3);
  }

  async showMore(): Promise<void> {
    this.showedList = this.achievementsList.slice(0, this.showedList.length + 3);
  }

  async showLess(): Promise<void> {
    this.showedList = this.achievementsList.slice(0, 3);
  }

}
