import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NavService} from "../../../services/nav/nav.service";
import {I18nService} from "../../../services/i18n/i18n.service";

enum Category {
  ALL = 'All',
  SYS = 'SysAdmin',
  DEV = 'Dev',
  DO = 'Devops'
}

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html'
})
export class AchievementsComponent implements OnInit {
  categories: any = [Category.ALL, Category.SYS, Category.DEV, Category.DO];
  achievementsList: any = [];
  showedList: any = [];

  constructor(private titleService: Title, private navService: NavService, public i18n: I18nService) {
    this.updateText();
  }

  ngOnInit(): void {
    this.navService.updateNav("real");

    this.titleService.setTitle("Gaetan • " + this.i18n.text.title.achievements);

    this.i18n.updateEvent.subscribe(() => {
      this.updateText();
    });
  }

  async showMore(): Promise<void> {
    this.showedList = this.achievementsList.slice(0, this.showedList.length + 3);
  }

  async showLess(): Promise<void> {
    this.showedList = this.achievementsList.slice(0, 3);
  }

  private updateText(): void {
    this.achievementsList = [
      {
        name: 'Content Delivery Network',
        description: this.i18n.text.achievements.cdn,
        image: 'assets/img/achievements/cdn.webp',
        redirect: 'https://cdn.gaetandev.fr/',
        categories: [Category.SYS, Category.DO]
      },
      {
        name: 'PizzaOPlomo',
        description: this.i18n.text.achievements.pizzaoplomo,
        image: 'assets/img/achievements/pizzaoplomo.webp',
        redirect: 'https://www.pizzaoplomo.gaetandev.fr/',
        categories: [Category.DEV]
      },
      {
        name: 'PixelmonGo',
        description: this.i18n.text.achievements.firstsky,
        image: 'assets/img/achievements/pixelmongo.webp',
        redirect: 'https://pixelmongo.fr/',
        categories: [Category.SYS]
      },
      {
        name: 'FirstSky',
        description: this.i18n.text.achievements.firstsky,
        image: 'assets/img/achievements/firstsky.webp',
        redirect: 'https://firstsky.net/',
        categories: [Category.SYS]
      },
      {
        name: 'Hôtel Neptune',
        description: this.i18n.text.achievements.neptune,
        image: 'assets/img/achievements/neptune.webp',
        redirect: 'https://github.com/Projet-Hotel-Neptune-GLJQR/Application',
        categories: [Category.DEV, Category.DO]
      },
      {
        name: 'FoxFood',
        description: this.i18n.text.achievements.pizzaoplomo,
        image: 'assets/img/achievements/foxfood.svg',
        redirect: 'https://github.com/Fox-Food',
        categories: [Category.DEV, Category.DO]
      },
      {
        name: 'ImmoCT',
        description: this.i18n.text.achievements.immoct,
        image: 'assets/img/achievements/immoct.webp',
        redirect: 'https://www.immoct.fr/',
        categories: [Category.DEV, Category.DO]
      },
      {
        name: 'CT-Energetique',
        description: this.i18n.text.achievements.ctenergetique,
        image: 'assets/img/achievements/ctenergetique.webp',
        redirect: 'https://www.ct-energetique.fr/',
        categories: [Category.DEV, Category.DO]
      },
      {
        name: 'HeavyCloud',
        description: this.i18n.text.achievements.heavycloud,
        image: 'assets/img/achievements/heavycloud.webp',
        redirect: '',
        categories: [Category.DEV]
      },
      {
        name: 'ChloeCM',
        description: this.i18n.text.achievements.chloecm,
        image: 'assets/img/achievements/chloecm.webp',
        redirect: 'https://www.chloecm.fr/',
        categories: [Category.DEV]
      },
      {
        name: 'VitaPot',
        description: this.i18n.text.achievements.vitapot,
        image: 'assets/img/achievements/VitaPot.webp',
        redirect: 'https://twitter.com/vitapot',
        categories: [Category.DEV, Category.SYS]
      },
      {
        name: 'PvPIng',
        description: this.i18n.text.achievements.pvping,
        image: 'assets/img/achievements/pvping.webp',
        redirect: 'https://twitter.com/ServeurPvPing',
        categories: [Category.DEV, Category.SYS]
      },
      {
        name: 'RealMC',
        description: this.i18n.text.achievements.liptonpvp,
        image: 'assets/img/achievements/realmc.webp',
        redirect: 'https://youtu.be/SD1547llpvI',
        categories: [Category.DEV, Category.SYS]
      },
      {
        name: 'LiptonPvP',
        description: this.i18n.text.achievements.liptonpvp,
        image: 'assets/img/achievements/liptonpvp.webp',
        redirect: 'https://youtu.be/l5aYEVQmop8',
        categories: [Category.DEV, Category.SYS]
      },
    ];

    this.showedList = this.achievementsList.slice(0, 3);
  }

}
