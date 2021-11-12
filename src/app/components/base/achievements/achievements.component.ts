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
      name: 'Firewall Template',
      description: "Un exemple de règles de pare-feu pouvant être utilisées pour un serveur Linux, pour bloquer certaines attaques.",
      image: 'assets/img/achievements/iptables.png',
      redirect: {
        link: 'https://github.com/GaetanOff/Firewall-Template',
        instant: false
      }
    },
    {
      name: 'Plugins Minecraft',
      description: "Plusieurs plugins fait pour le jeu Minecraft grâce au langage de programmation Java.",
      image: 'assets/img/achievements/Java-Logo.png',
      redirect: {
        link: '/achievements/javaplugins',
        instant: true
      }
    },
    {
      name: 'Portfolio',
      description: "Le côté graphique de mon portfolio et le côté serveur fait avec Laravel.",
      image: 'assets/img/achievements/Portfolio.png',
      redirect: {
        link: 'https://github.com/GaetanOff/Front-GaetanDev',
        instant: false
      }
    },
    {
      name: 'Content Delivery Network',
      description: "Mon réseau de distribution de contenu pour pouvoir avoir une diffusion rapides et fiables.",
      image: 'assets/img/achievements/cloud.png',
      redirect: {
        link: 'https://cdn.gaetandev.fr/',
        instant: false
      }
    },
    {
      name: 'Bot Discord Template',
      description: "Un template pour faire des bot discord, une version en GoLang et en C# est disponible.",
      image: 'assets/img/achievements/Discord_Color_Logo.png',
      redirect: {
        link: 'https://github.com/GaetanOff/DiscordApplication',
        instant: false
      }
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
