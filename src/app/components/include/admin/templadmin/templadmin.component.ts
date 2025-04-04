import {Component, OnInit} from '@angular/core';
import {NavService} from "../../../../services/nav/nav.service";
import {AdminService} from "../../../../services/admin/admin.service";
import {toast} from 'ngx-sonner';
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-templadmin',
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './templadmin.component.html'
})
export class TempladminComponent implements OnInit {
  protected readonly toast = toast;

  constructor(public navService: NavService, private adminService: AdminService) {
  }

  ngOnInit(): void {
  }

  async toggleMenu(): Promise<void> {
    this.navService.isAdminNavOpened = !this.navService.isAdminNavOpened;
  }

  async logout(): Promise<void> {
    const loadingToast: string | number = this.toast.loading("Logging out...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.toast.success('Successfully logged out', {id: loadingToast});
    await this.adminService.logout();
  }

}
