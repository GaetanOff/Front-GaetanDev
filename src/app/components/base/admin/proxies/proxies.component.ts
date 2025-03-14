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

export interface ScanningServer {
  id: number;
  status: string;
  cpu: number;
  ram: number;
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
  scanningServers: ScanningServer[] = [];
  httpProxies: ProxyDetails[] = [];
  socks5Proxies: ProxyDetails[] = [];
  lastRefresh: string = '';
  isLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();
  protected readonly toast = toast;

  selectedProxyType: 'http' | 'socks5' = 'http';
  proxyLimit: number = 10;

  countries: string[] = [];
  httpCountries: string[] = [];
  socks5Countries: string[] = [];

  countryFilters: string[] = ['All'];

  showServers: boolean = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.refreshServersStatus().catch(() => this.toast.error("Failed to fetch scanning servers."));
    interval(5000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.refreshServersStatus());

    this.refreshProxies().catch(() => this.toast.error("Failed to refresh proxies."));
    interval(60000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.refreshProxies());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get filteredCountries(): string[] {
    return this.countries.filter(c => c !== 'All');
  }

  async refreshServersStatus(): Promise<void> {
    this.adminService.getScanningProxyServers().subscribe({
      next: (response: ScanningServer[]) => {
        this.scanningServers = response;
      },
      error: () => {
        this.toast.error("Failed to fetch scanning servers.");
      }
    });
  }

  async refreshProxies(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;
    const loadingToast = this.toast.loading("Refreshing proxies...");

    this.adminService.getProxies().subscribe({
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

        this.updateAvailableCountries();
        this.updateProxyLimit();

        this.toast.success("Proxies refreshed", { id: loadingToast });
        this.isLoading = false;
      },
      error: () => {
        this.toast.error("Failed to refresh proxies.");
        this.isLoading = false;
      }
    });
  }

  updateAvailableCountries(): void {
    if (this.selectedProxyType === 'http') {
      this.countries = ['All', ...this.httpCountries];
    } else {
      this.countries = ['All', ...this.socks5Countries];
    }
    if (this.countryFilters.length > 1) {
      this.countryFilters = this.countryFilters.map(filter =>
        filter === 'All' ? (this.countries.filter(c => c !== 'All')[0] || this.countries[0]) : filter
      );
    } else {
      this.countryFilters = this.countryFilters.map(filter =>
        this.countries.includes(filter) ? filter : 'All'
      );
    }
  }

  updateProxyLimit(): void {
    const duplicates = this.getDuplicateISO(this.countryFilters);
    if (duplicates.length > 0) {
      this.toast.error("Duplicate ISO code selected: " + duplicates.join(', '));
      return;
    }
    let filteredProxies: ProxyDetails[];
    if (this.selectedProxyType === 'http') {
      filteredProxies = this.httpProxies;
    } else {
      filteredProxies = this.socks5Proxies;
    }
    if (!(this.countryFilters.length === 1 && this.countryFilters[0] === 'All')) {
      filteredProxies = filteredProxies.filter(
        proxy => this.countryFilters.includes(proxy.geolocation?.country?.iso_code)
      );
    }
    this.proxyLimit = filteredProxies.length;
  }

  addCountryFilter(): void {
    this.countryFilters.push('All');
    this.updateAvailableCountries();
    this.updateProxyLimit();
  }

  removeCountryFilter(index: number): void {
    if (this.countryFilters.length > 1) {
      this.countryFilters.splice(index, 1);
      this.updateAvailableCountries();
      this.updateProxyLimit();
    }
  }

  downloadFilteredProxies(): void {
    const duplicates = this.getDuplicateISO(this.countryFilters);
    if (duplicates.length > 0) {
      this.toast.error("Duplicate ISO code selected: " + duplicates.join(', '));
      return;
    }
    let filteredProxies: ProxyDetails[];
    if (this.selectedProxyType === 'http') {
      filteredProxies = this.httpProxies;
    } else {
      filteredProxies = this.socks5Proxies;
    }
    if (!(this.countryFilters.length === 1 && this.countryFilters[0] === 'All')) {
      filteredProxies = filteredProxies.filter(
        proxy => this.countryFilters.includes(proxy.geolocation?.country?.iso_code)
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
    a.download = `${this.selectedProxyType}-proxies-${this.countryFilters.join('_')}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
    this.toast.success("Proxies downloaded successfully.");
  }

  private getDuplicateISO(filters: string[]): string[] {
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    for (const code of filters) {
      if (seen.has(code)) {
        duplicates.add(code);
      } else {
        seen.add(code);
      }
    }
    return Array.from(duplicates);
  }
}
