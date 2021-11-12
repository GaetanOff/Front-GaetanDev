import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-languages',
  templateUrl: '/languages.component.html'
})
export class LanguagesComponent implements OnInit {
  langList = ['Français', 'Anglais'];

  constructor() {
  }

  ngOnInit(): void {
  }

}
