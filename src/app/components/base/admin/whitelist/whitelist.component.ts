import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AdminService} from '../../../../services/admin/admin.service';
import {toast} from 'ngx-sonner';
import {interval, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {z} from "zod";
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {RemoveIpSkeletonsComponent} from "../../../include/skeletons/remove-ip-skeletons/remove-ip-skeletons.component";
import {FormsModule, NgModel} from "@angular/forms";
import {
  WhitelistedIpsSkeletonsComponent
} from "../../../include/skeletons/whitelisted-ips-skeletons/whitelisted-ips-skeletons.component";
import {AddIpSkeletonsComponent} from "../../../include/skeletons/add-ip-skeletons/add-ip-skeletons.component";
import {TempladminComponent} from "../../../include/admin/templadmin/templadmin.component";

@Component({
  selector: 'app-whitelist',
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    TempladminComponent,
    WhitelistedIpsSkeletonsComponent,
    AddIpSkeletonsComponent,
    RemoveIpSkeletonsComponent,
  ],
  templateUrl: './whitelist.component.html',
})
export class WhitelistComponent implements OnInit, OnDestroy {
  address: string | undefined;
  server: number | undefined;
  whitelistedIPs: string[] = [];
  isLoading: boolean = false
  isAdding: boolean = false
  removingIp: string | null = null
  protected readonly toast = toast;
  private unsubscribe$ = new Subject<void>();

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) {
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
      .ip({version: "v4"})
      .refine(ip => ip !== '127.0.0.1', {message: "You cannot add 127.0.0.1 to the whitelist."})
      .refine(ip => !this.whitelistedIPs.includes(ip), {message: "IP already whitelisted."});

    const result = ipSchema.safeParse(this.address);
    if (!result.success) {
      this.toast.error(result.error.errors[0].message);
      return;
    }

    this.isAdding = true;

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

  get hasWhitelistedIPs(): boolean {
    return this.whitelistedIPs.filter(ip => ip !== '127.0.0.1').length > 0;
  }

  async removeWhitelistedIP(ip: string): Promise<void> {
    if (this.removingIp) {
      this.toast.error("An IP removal is already in progress.");
      return;
    }

    this.removingIp = ip;

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

    this.adminService.getWhitelistedIPs().subscribe({
      next: async (response: string[]): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.whitelistedIPs = response;
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.success("Whitelist refreshed", {id: loadingToast});
      },
      error: async (error): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error("Error fetching whitelisted IPs");
        console.error("Error fetching whitelisted IPs:", error);
      }
    });
  }
}
