import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../../services/admin/admin.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.checkAdmin();
  }

}
