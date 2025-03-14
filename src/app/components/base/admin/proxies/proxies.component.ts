import { Component } from '@angular/core';
import {TempladminComponent} from "../../../include/admin/templadmin/templadmin.component";
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {AdminService} from "../../../../services/admin/admin.service";

@Component({
  selector: 'app-proxies',
  imports: [
    NgFor,
    CommonModule,
    TempladminComponent
  ],
  templateUrl: './proxies.component.html'
})
export class ProxiesComponent {
  httpProxies: string[] = [];
  socks5Proxies: string[] = [];
  lastRefresh: string = '';
  isLoading: boolean = false;

  constructor(private adminService: AdminService) {
    this.refreshProxies();
  }

  refreshProxies(): void {
    this.isLoading = true;
    this.adminService.getProxies()
      .subscribe({
        next: response => {
          this.httpProxies = response.http;
          this.socks5Proxies = response.socks5;
          this.lastRefresh = response.lastRefresh;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  downloadProxies(type: 'http' | 'socks5'): void {
    const proxies = type === 'http' ? this.httpProxies : this.socks5Proxies;
    const blob = new Blob([proxies.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${type}-proxies.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
