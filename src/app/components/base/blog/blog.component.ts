import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NavService} from "../../../services/nav/nav.service";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html'
})
export class BlogComponent implements OnInit {
  blogsList = [
    {
      name: 'Mes débuts dans la programmation',
      description: "Comment ai-je commencé le développement ? Pourquoi ai-je commencé ? Comment vois-je mon avenir dans ce domaine ?",
      redirect: '/blog/how_i_started'
    }
  ];

  constructor(private titleService: Title, private navService: NavService) {
  }

  ngOnInit(): void {
    this.navService.updateNav();

    // @ts-ignore
    document.getElementById("blog").classList.toggle("font-bold");

    this.titleService.setTitle("Gaetan • Blog");
  }

}
