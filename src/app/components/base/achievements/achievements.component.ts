import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NavService} from "../../../services/nav/nav.service";

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html'
})
export class AchievementsComponent implements OnInit {

  constructor(private titleService: Title, private navService: NavService) {
  }

  ngOnInit(): void {
    this.navService.updateNav();

    // @ts-ignore
    document.getElementById("real").classList.toggle("font-bold");

    this.titleService.setTitle("Gaetan • Réalisations");
  }

}
