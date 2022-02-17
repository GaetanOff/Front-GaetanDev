import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NavService} from "../../../services/nav/nav.service";

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html'
})
export class AchievementsComponent implements OnInit {
  achievementsList = [
    {
      name: 'Portfolio',
      description: "Le côté graphique de mon portfolio et le côté serveur.",
      image: 'assets/img/achievements/Portfolio.png',
      redirect: 'https://github.com/GaetanOff/Front-GaetanDev'
    },
    {
      name: 'Firewall Template',
      description: "Un exemple de règles de pare-feu pouvant être utilisées pour un serveur Minecraft, pour diminuer les attaques.",
      image: 'assets/img/achievements/iptables.png',
      redirect: 'https://github.com/GaetanOff/Firewall-Template'
    },
    {
      name: 'Plugiciel KryxCore',
      description: "Plugiciel codé en Java pour le serveur Minecraft KryxMC.",
      image: 'assets/img/achievements/KryxMC.png',
      redirect: 'https://github.com/GaetanOff/KryxCore'
    },
    {
      name: 'Content Delivery Network',
      description: "Mon réseau de distribution de contenu pour pouvoir avoir une diffusion rapides et fiables.",
      image: 'assets/img/achievements/cloud.png',
      redirect: 'https://cdn.gaetandev.fr/'
    }
  ];

  constructor(private titleService: Title, private navService: NavService) {
  }

  ngOnInit(): void {
    this.navService.updateNav();

    // @ts-ignore
    document.getElementById("real").classList.toggle("font-bold");

    this.titleService.setTitle("Gaetan • Réalisations");
  }

}
