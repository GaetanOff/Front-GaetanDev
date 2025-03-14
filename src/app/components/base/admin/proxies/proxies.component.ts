import {Component, OnDestroy, OnInit} from '@angular/core';
import {TempladminComponent} from "../../../include/admin/templadmin/templadmin.component";
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {AdminService} from "../../../../services/admin/admin.service";
import {interval, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {toast} from 'ngx-sonner';
import {
  RefreshProxiesWhitelistComponent
} from "../../../include/skeletons/refresh-proxies-whitelist/refresh-proxies-whitelist.component";
import {FormsModule, NgModel} from "@angular/forms";

@Component({
  selector: 'app-proxies',
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    CommonModule,
    TempladminComponent,
    RefreshProxiesWhitelistComponent
  ],
  templateUrl: './proxies.component.html'
})
export class ProxiesComponent implements OnInit, OnDestroy {
  httpProxies: string[] = [];
  socks5Proxies: string[] = [];
  lastRefresh: string = '';
  isLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();
  protected readonly toast = toast;

  selectedCountry: string = 'All';
  selectedProxyType: 'http' | 'socks5' = 'http';
  proxyLimit: number = 10;

  // Liste des pays
  countries: string[] = ['All', 'US', 'UK', 'FR', 'DE', 'NL', 'CA', 'RU', 'CN', 'IN'];

  constructor(private adminService: AdminService) {
  }

  ngOnInit() {
    this.refreshProxies().catch(() => this.toast.error("Failed to refresh whitelist."));

    interval(60000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.refreshProxies());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async refreshProxies(): Promise<void> {
    if (this.isLoading) return;

    this.isLoading = true;
    const loadingToast: string | number = this.toast.loading("Refreshing proxies...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.adminService.getProxies()
      .subscribe({
        next: response => {
          this.httpProxies = response.http;
          this.socks5Proxies = response.socks5;
          this.lastRefresh = response.lastRefresh;
          this.toast.success("Proxies refreshed", {id: loadingToast});
          this.isLoading = false;
        },
        error: () => {
          this.toast.error("Failed to refresh whitelist.");
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

  downloadFilteredProxies(): void {
    let filteredProxies: string[];

    if (this.selectedProxyType === 'http') {
      filteredProxies = this.httpProxies;
    } else {
      filteredProxies = this.socks5Proxies;
    }

    if (this.selectedCountry !== 'All') {
      filteredProxies = filteredProxies.filter(proxy => proxy.includes(this.selectedCountry));
    }

    filteredProxies = filteredProxies.slice(0, this.proxyLimit);

    if (filteredProxies.length === 0) {
      this.toast.error("No proxies available for selected criteria.");
      return;
    }

    const blob = new Blob([filteredProxies.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${this.selectedProxyType}-proxies-${this.selectedCountry}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);

    this.toast.success("Proxies downloaded successfully.");
  }
}
