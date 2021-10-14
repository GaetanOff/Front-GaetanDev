import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-javaplugins',
  templateUrl: './javaplugins.component.html',
  styleUrls: ['./javaplugins.component.css']
})
export class JavapluginsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  staffPin() {
    window.open("https://github.com/GaetanOff/StaffPin");
  }

  staffSecurity() {
    window.open("https://github.com/GaetanOff/StaffSecurity");
  }

  ffaRush() {
    window.open("https://github.com/GaetanOff/FFARush");
  }
}
