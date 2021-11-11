import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NavService} from "../../../services/nav/nav.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(private titleService: Title, private navService: NavService) {
  }

  ngOnInit(): void {
    this.navService.updateNav();

    // @ts-ignore
    document.getElementById("accueil").classList.toggle("font-bold");

    this.titleService.setTitle("Gaetan • DevOps");
  }

}
