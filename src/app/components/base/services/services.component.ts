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

  // @ts-ignore
  if (document.getElementById("about").classList.contains("font-bold")) {
    // @ts-ignore
    document.getElementById("about").classList.toggle("font-bold");
  }
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    clear();

    // @ts-ignore
    document.getElementById("serv").classList.toggle("font-bold");
  }

}
