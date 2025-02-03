import { Component, OnInit } from '@angular/core';
import {NavService} from "../../../../services/nav/nav.service";
import {AdminService} from "../../../../services/admin/admin.service";
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-templadmin',
  templateUrl: './templadmin.component.html'
})
export class TempladminComponent implements OnInit {
  protected readonly toast = toast;

  constructor(public navService: NavService, private adminService: AdminService) { }

  ngOnInit(): void {
  }

  async toggleMenu(): Promise<void> {
    this.navService.isAdminNavOpened = !this.navService.isAdminNavOpened;
  }

  async logout(): Promise<void> {
    this.toast.success('Successfully logged out');
    await this.adminService.logout();
  }

}
