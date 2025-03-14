import { Component, OnDestroy, OnInit } from '@angular/core';
import { TempladminComponent } from "../../../include/admin/templadmin/templadmin.component";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { AdminService } from "../../../../services/admin/admin.service";
import { interval, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { toast } from 'ngx-sonner';
import { RefreshProxiesWhitelistComponent } from "../../../include/skeletons/refresh-proxies-whitelist/refresh-proxies-whitelist.component";
import { FormsModule } from "@angular/forms";

export interface ProxyDetails {
  protocol: string;
  host: string;
  port: number;
  geolocation: {
    country: {
      iso_code: string;
    }
  }
}

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
  httpProxies: ProxyDetails[] = [];
  socks5Proxies: ProxyDetails[] = [];
  lastRefresh: string = '';
  isLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();
  protected readonly toast = toast;

  selectedCountry: string = 'All';
  selectedProxyType: 'http' | 'socks5' = 'http';
  proxyLimit: number = 10;

  countries: string[] = [];

  httpCountries: string[] = [];
  socks5Countries: string[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.refreshProxies().catch(() => this.toast.error("Failed to refresh proxies."));
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
    const loadingToast = this.toast.loading("Refreshing proxies...");

    this.adminService.getProxies()
      .subscribe({
        next: response => {
          this.httpProxies = response.http;
          this.socks5Proxies = response.socks5;
          this.lastRefresh = response.lastRefresh;

          const httpCountrySet = new Set<string>();
          this.httpProxies.forEach((proxy: ProxyDetails) => {
            if (proxy.geolocation?.country?.iso_code) {
              httpCountrySet.add(proxy.geolocation.country.iso_code);
            }
          });
          this.httpCountries = Array.from(httpCountrySet).sort();

          const socks5CountrySet = new Set<string>();
          this.socks5Proxies.forEach((proxy: ProxyDetails) => {
            if (proxy.geolocation?.country?.iso_code) {
              socks5CountrySet.add(proxy.geolocation.country.iso_code);
            }
          });
          this.socks5Countries = Array.from(socks5CountrySet).sort();

          this.updateCountryList();

          this.toast.success("Proxies refreshed", { id: loadingToast });
          this.isLoading = false;
        },
        error: () => {
          this.toast.error("Failed to refresh proxies.");
          this.isLoading = false;
        }
      });
  }

  updateCountryList(): void {
    if (this.selectedProxyType === 'http') {
      this.countries = ['All', ...this.httpCountries];
    } else {
      this.countries = ['All', ...this.socks5Countries];
    }
    if (!this.countries.includes(this.selectedCountry)) {
      this.selectedCountry = 'All';
    }
  }

  downloadFilteredProxies(): void {
    let filteredProxies: ProxyDetails[];

    if (this.selectedProxyType === 'http') {
      filteredProxies = this.httpProxies;
    } else {
      filteredProxies = this.socks5Proxies;
    }

    if (this.selectedCountry !== 'All') {
      filteredProxies = filteredProxies.filter(
        proxy => proxy.geolocation?.country?.iso_code === this.selectedCountry
      );
    }

    filteredProxies = filteredProxies.slice(0, this.proxyLimit);

    if (filteredProxies.length === 0) {
      this.toast.error("No proxies available for selected criteria.");
      return;
    }

    const lines = filteredProxies.map(proxy => `${proxy.host}:${proxy.port}`);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${this.selectedProxyType}-proxies-${this.selectedCountry}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);

    this.toast.success("Proxies downloaded successfully.");
  }
}
