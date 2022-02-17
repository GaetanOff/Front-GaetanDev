import { Component, OnInit } from '@angular/core';
import {NavService} from "../../../services/nav/nav.service";

@Component({
  selector: 'app-cgv',
  templateUrl: './cgv.component.html'
})
export class CgvComponent implements OnInit {

  constructor(private navService: NavService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.navService.updateNav();
  }

}
