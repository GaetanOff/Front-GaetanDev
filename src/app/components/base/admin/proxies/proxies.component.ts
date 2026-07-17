import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { TempladminComponent } from "../../../include/admin/templadmin/templadmin.component";
import { CommonModule } from "@angular/common";
import { AdminService } from "../../../../services/admin/admin.service";
import { ProxyFilterService } from "../../../../services/admin/proxy-filter.service";
import { Subject } from "rxjs";
import { toast } from 'ngx-sonner';
import { SkeletonComponent } from "../../../include/skeletons/skeleton.component";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ProxyCheckResponse, ProxyDetails, ScanningServer } from "../../../../types";
import { runRefreshLoad, startPolling } from "../../../../utils/polling.utils";

@Component({
  selector: 'app-proxies',
  imports: [
    FormsModule,
    CommonModule,
    TempladminComponent,
    SkeletonComponent
  ],
  templateUrl: './proxies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProxiesComponent implements OnInit, OnDestroy {
  readonly scanningServers = signal<ScanningServer[]>([]);
  readonly httpProxies = signal<ProxyDetails[]>([]);
  readonly socks5Proxies = signal<ProxyDetails[]>([]);
  readonly lastRefresh = signal('');
  readonly isLoading = signal(false);
  readonly isCheckerLoading = signal(false);
  readonly countries = signal<string[]>([]);
  readonly countryFilters = signal<string[]>(['All']);
  readonly proxyLimit = signal(10);
  readonly proxyCheckResult = signal<ProxyCheckResponse | null>(null);
  readonly showServers = signal(false);
  readonly showProxy = signal(false);

  selectedProxyType: 'http' | 'socks5' = 'http';
  proxyProtocol: string = 'http';
  serverToCheck: string = 'random';
  proxyHost: string = '';
  proxyPort: number = 0;

  private httpCountries: string[] = [];
  private socks5Countries: string[] = [];
  private unsubscribe$ = new Subject<void>();
  protected readonly toast = toast;

  private adminService = inject(AdminService);
  private proxyFilter = inject(ProxyFilterService);
  private router = inject(Router);

  ngOnInit() {
    window.scrollTo(0, 0);
    startPolling(5000, this.unsubscribe$, () => this.refreshServersStatus());
    startPolling(60000, this.unsubscribe$, () => this.refreshProxies());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get filteredCountries(): string[] {
    return this.countries().filter(c => c !== 'All');
  }

  refreshServersStatus(): void {
    this.adminService.getScanningProxyServers().subscribe({
      next: (response: ScanningServer[]) => {
        this.scanningServers.set(response);
      },
      error: () => {
        this.toast.error("Failed to fetch scanning servers.");
      }
    });
  }

  refreshProxies(): void {
    if (this.isLoading()) return;

    const loadingToast = this.toast.loading("Refreshing proxies...");

    runRefreshLoad({
      isBusy: () => this.isLoading(),
      setBusy: (busy) => this.isLoading.set(busy),
      request: () => this.adminService.getProxies(),
      onSuccess: (response) => {
        this.httpProxies.set(response.http);
        this.socks5Proxies.set(response.socks5);
        this.lastRefresh.set(response.lastRefresh);
        this.httpCountries = this.proxyFilter.collectCountries(response.http);
        this.socks5Countries = this.proxyFilter.collectCountries(response.socks5);
        this.updateAvailableCountries();
        this.updateProxyLimit();
      },
      loadingToast,
      successToast: (id) => this.toast.success("Proxies refreshed", { id }),
      errorToast: () => this.toast.error("Failed to refresh proxies."),
    });
  }

  updateAvailableCountries(): void {
    const nextCountries = this.selectedProxyType === 'http'
      ? ['All', ...this.httpCountries]
      : ['All', ...this.socks5Countries];
    this.countries.set(nextCountries);

    const filters = this.countryFilters();
    if (filters.length > 1) {
      this.countryFilters.set(filters.map(filter =>
        filter === 'All' ? (nextCountries.filter(c => c !== 'All')[0] || nextCountries[0]) : filter
      ));
    } else {
      this.countryFilters.set(filters.map(filter =>
        nextCountries.includes(filter) ? filter : 'All'
      ));
    }

    this.updateProxyLimit();
  }

  updateProxyLimit(): void {
    const filters = this.countryFilters();
    const duplicates = this.proxyFilter.getDuplicateISO(filters);
    if (duplicates.length > 0) {
      this.toast.error("Duplicate ISO code selected: " + duplicates.join(', '));
      return;
    }
    const source = this.selectedProxyType === 'http' ? this.httpProxies() : this.socks5Proxies();
    const filteredProxies = this.proxyFilter.filterProxies(source, filters);
    this.proxyLimit.set(filteredProxies.length);
  }

  onProxyTypeChange(): void {
    this.updateAvailableCountries();
    this.updateProxyLimit();
  }

  addCountryFilter(): void {
    this.countryFilters.update(filters => [...filters, 'All']);
    this.updateAvailableCountries();
    this.updateProxyLimit();
  }

  removeCountryFilter(index: number): void {
    if (this.countryFilters().length > 1) {
      this.countryFilters.update(filters => filters.filter((_, i) => i !== index));
      this.updateAvailableCountries();
      this.updateProxyLimit();
    }
  }

  setCountryFilter(index: number, value: string): void {
    this.countryFilters.update(filters => filters.map((f, i) => i === index ? value : f));
    this.updateProxyLimit();
  }

  downloadFilteredProxies(): void {
    const filters = this.countryFilters();
    const duplicates = this.proxyFilter.getDuplicateISO(filters);
    if (duplicates.length > 0) {
      this.toast.error("Duplicate ISO code selected: " + duplicates.join(', '));
      return;
    }

    const source = this.selectedProxyType === 'http' ? this.httpProxies() : this.socks5Proxies();
    const filteredProxies = this.proxyFilter.filterProxies(source, filters, this.proxyLimit());

    if (filteredProxies.length === 0) {
      this.toast.error("No proxies available for selected criteria.");
      return;
    }

    const lines = filteredProxies.map(proxy => `${proxy.host}:${proxy.port}`);
    this.proxyFilter.downloadAsTextFile(
      lines,
      `${this.selectedProxyType}-proxies-${filters.join('_')}.txt`
    );
    this.toast.success("Proxies downloaded successfully.");
  }

  async checkProxy(event: Event): Promise<void> {
    event.preventDefault();
    this.proxyCheckResult.set(null);

    if (!this.proxyHost || !this.proxyPort) {
      this.toast.error("Please enter a valid proxy host and port.");
      return;
    }

    this.isCheckerLoading.set(true);
    const lastToast: string | number = this.toast.loading("Checking proxy...");

    this.adminService.checkProxy(this.proxyProtocol, this.proxyHost, this.proxyPort, this.serverToCheck).subscribe({
      next: (response: ProxyCheckResponse) => {
        if (response.success) {
          this.toast.success("Proxy checked successfully.", { id: lastToast });
        } else {
          this.toast.error("Proxy check failed.", { id: lastToast });
        }
        this.isCheckerLoading.set(false);
        this.proxyCheckResult.set(response);
      },
      error: () => {
        this.toast.error("Error checking proxy.", { id: lastToast });
        this.isCheckerLoading.set(false);
      }
    });
  }

  closeProxyChecker(): void {
    this.showProxy.set(false);
    this.proxyCheckResult.set(null);
  }

  navigateToDetails(serverId: number) {
    this.router.navigate(['/admin/proxies/details', serverId]);
  }
}
