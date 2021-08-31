import {Component, OnInit} from '@angular/core';

function clear() {
  // @ts-ignore
  if (document.getElementById("serv").classList.contains("font-bold")) {
    // @ts-ignore
    document.getElementById("serv").classList.toggle("font-bold");
  }

  // @ts-ignore
  if (document.getElementById("contact").classList.contains("font-bold")) {
    // @ts-ignore
    document.getElementById("contact").classList.toggle("font-bold");
  }

  // @ts-ignore
  if (document.getElementById("real").classList.contains("font-bold")) {
    // @ts-ignore
    document.getElementById("real").classList.toggle("font-bold");
  }
}

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    clear();

    // @ts-ignore
    document.getElementById("real").classList.toggle("font-bold");
  }

}
