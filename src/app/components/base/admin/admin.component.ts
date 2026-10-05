import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TempladminComponent } from "../../include/admin/templadmin/templadmin.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [
    TempladminComponent
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class AdminComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
