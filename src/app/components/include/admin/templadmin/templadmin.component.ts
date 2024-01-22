import { Component, OnInit } from '@angular/core';
import {NavService} from "../../../../services/nav/nav.service";
import {AdminService} from "../../../../services/admin/admin.service";

@Component({
  selector: 'app-templadmin',
  templateUrl: './templadmin.component.html'
})
export class TempladminComponent implements OnInit {

  constructor(public navService: NavService, private adminService: AdminService) { }

  ngOnInit(): void {
  }

  async toggleMenu(): Promise<void> {
    this.navService.isAdminNavOpened = !this.navService.isAdminNavOpened;
  }

  async logout(): Promise<void> {
    this.adminService.logout();
  }

}
