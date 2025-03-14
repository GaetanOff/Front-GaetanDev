import {Component, OnInit} from '@angular/core';
import {TempladminComponent} from "../../include/admin/templadmin/templadmin.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [
    TempladminComponent
  ],
  standalone: true,
})
export class AdminComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
