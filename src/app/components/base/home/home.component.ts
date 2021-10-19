import {Component, OnInit} from '@angular/core';

function clear() {
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

  // @ts-ignore
  if (document.getElementById("about").classList.contains("font-bold")) {
    // @ts-ignore
    document.getElementById("about").classList.toggle("font-bold");
  }

  // @ts-ignore
  if (document.getElementById("accueil").classList.contains("font-bold")) {
    // @ts-ignore
    document.getElementById("accueil").classList.toggle("font-bold");
  }

  // @ts-ignore
  if (document.getElementById("blog").classList.contains("font-bold")) {
    // @ts-ignore
    document.getElementById("blog").classList.toggle("font-bold");
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    clear();
    // @ts-ignore
    document.getElementById("accueil").classList.toggle("font-bold");
  }
}
