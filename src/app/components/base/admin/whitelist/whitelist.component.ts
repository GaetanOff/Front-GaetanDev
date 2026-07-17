import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AdminService } from '../../../../services/admin/admin.service';
import { toast } from 'ngx-sonner';
import { Subject } from 'rxjs';
import { z } from "zod";

import { SkeletonComponent } from "../../../include/skeletons/skeleton.component";
import { FormsModule } from "@angular/forms";
import { TempladminComponent } from "../../../include/admin/templadmin/templadmin.component";
import { runRefreshLoad, startPolling } from '../../../../utils/polling.utils';

@Component({
  selector: 'app-whitelist',
  imports: [
    FormsModule,
    TempladminComponent,
    SkeletonComponent
  ],
  templateUrl: './whitelist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhitelistComponent implements OnInit, OnDestroy {
  address: string | undefined;
  server: number | undefined;

  readonly whitelistedIPs = signal<string[]>([]);
  readonly isLoading = signal(false);
  readonly isAdding = signal(false);
  readonly removingIp = signal<string | null>(null);

  readonly hasWhitelistedIPs = computed(() =>
    this.whitelistedIPs().filter(ip => ip !== '127.0.0.1').length > 0
  );

  protected readonly toast = toast;
  private unsubscribe$ = new Subject<void>();
  private adminService = inject(AdminService);

  ngOnInit(): void {
    startPolling(60000, this.unsubscribe$, () => this.updateWhitelistedIPs());
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

    const currentIps = this.whitelistedIPs();
    const ipSchema = z
      .string()
      .ip({ version: "v4" })
      .refine(ip => ip !== '127.0.0.1', { message: "You cannot add 127.0.0.1 to the whitelist." })
      .refine(ip => !currentIps.includes(ip), { message: "IP already whitelisted." });

    const result = ipSchema.safeParse(this.address);
    if (!result.success) {
      this.toast.error(result.error.errors[0].message);
      return;
    }

    this.isAdding.set(true);

    this.adminService.addWhitelistedIP(this.address).subscribe({
      next: (): void => {
        this.toast.success('IP whitelisted.');
        if (this.address) {
          this.whitelistedIPs.update(ips => [...ips, this.address!]);
        }
        this.isAdding.set(false);
      },
      error: (): void => {
        this.toast.error("Error adding IP.");
        this.isAdding.set(false);
      }
    });
  }

  async removeWhitelistedIP(ip: string): Promise<void> {
    if (this.removingIp()) {
      this.toast.error("An IP removal is already in progress.");
      return;
    }

    this.removingIp.set(ip);

    this.adminService.removeWhitelistedIP(ip).subscribe({
      next: (): void => {
        this.toast.success('IP removed from whitelist');
        this.whitelistedIPs.update(ips => ips.filter(value => value !== ip));
      },
      error: (): void => {
        this.toast.error("Error removing IP.");
      },
      complete: (): void => {
        this.removingIp.set(null);
      }
    });
  }

  private updateWhitelistedIPs(): void {
    if (this.isLoading()) return;

    const loadingToast = this.toast.loading("Refreshing whitelist...");

    runRefreshLoad({
      isBusy: () => this.isLoading(),
      setBusy: (busy) => this.isLoading.set(busy),
      request: () => this.adminService.getWhitelistedIPs(),
      onSuccess: (response) => {
        this.whitelistedIPs.set(response);
      },
      onError: (error) => {
        console.error("Error fetching whitelisted IPs:", error);
      },
      loadingToast,
      successToast: (id) => this.toast.success("Whitelist refreshed", { id }),
      errorToast: () => this.toast.error("Error fetching whitelisted IPs"),
    });
  }
}
