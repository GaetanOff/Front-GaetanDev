import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdminService} from '../../../../services/admin/admin.service';
import { toast } from 'ngx-sonner';
import {interval, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {z} from "zod";

@Component({
    selector: 'app-whitelist',
    templateUrl: './whitelist.component.html',
    standalone: false
})
export class WhitelistComponent implements OnInit, OnDestroy {
  protected readonly toast = toast;

  address: string | undefined;
  server: number | undefined;
  whitelistedIPs: string[] = [];
  isLoading: boolean = false
  isAdding: boolean = false
  removingIp: string | null = null

  private unsubscribe$ = new Subject<void>();

  constructor(private adminService: AdminService) {
  }

  ngOnInit(): void {
    this.updateWhitelistedIPs().catch(() => console.error('Error fetching whitelisted IPs'));

    interval(60000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.updateWhitelistedIPs());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async processForm(): Promise<void> {
    if (!this.address) {
      this.toast.error("Invalid form");
      return;
    }

    const ipSchema = z
      .string()
      .ip({ version: "v4" })
      .refine(ip => ip !== '127.0.0.1', { message: "You cannot add 127.0.0.1 to the whitelist." })
      .refine(ip => !this.whitelistedIPs.includes(ip), { message: "IP already whitelisted." });

    const result = ipSchema.safeParse(this.address);
    if (!result.success) {
      this.toast.error(result.error.errors[0].message);
      return;
    }

    this.isAdding = true;
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.adminService.addWhitelistedIP(this.address).subscribe({
      next: (): void => {
        this.toast.success('IP whitelisted.');
        if (this.address) this.whitelistedIPs.push(this.address);
        this.isAdding = false;
      },
      error: (): void => {
        this.toast.error("Error adding IP.");
        this.isAdding = false;
      }
    });
  }

  async removeWhitelistedIP(ip: string): Promise<void> {
    if (this.removingIp) {
      this.toast.error("An IP removal is already in progress.");
      return;
    }

    this.removingIp = ip;
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.adminService.removeWhitelistedIP(ip).subscribe({
      next: (): void => {
        this.toast.success('IP removed from whitelist');
        this.whitelistedIPs = this.whitelistedIPs.filter(value => value !== ip);
      },
      error: (): void => {
        this.toast.error("Error removing IP.");
      },
      complete: (): void => {
        this.removingIp = null;
      }
    });
  }

  private async updateWhitelistedIPs(): Promise<void> {
    if (this.isLoading) return;

    this.isLoading = true;
    const loadingToast: string | number = this.toast.loading("Refreshing whitelist...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.adminService.getWhitelistedIPs().subscribe({
      next: (response: string[]): void => {
        this.whitelistedIPs = response;
        this.toast.success("Whitelist refreshed", { id: loadingToast });
      },
      error: (error): void => {
        this.toast.error("Error fetching whitelisted IPs");
        console.error("Error fetching whitelisted IPs:", error);
      },
      complete: (): void => {
        this.isLoading = false;
      }
    });
  }
}
