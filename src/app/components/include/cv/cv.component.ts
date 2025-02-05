import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-cv',
    template: `
    <app-competences></app-competences>
    <app-certif></app-certif>
    <app-experience></app-experience>
    <app-languages></app-languages>
  `,
    standalone: false
})
export class CVComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
