import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { NgClass } from "@angular/common";
import { TempladminComponent } from "../../../../include/admin/templadmin/templadmin.component";
import { SkeletonComponent } from "../../../../include/skeletons/skeleton.component";
import { toast } from 'ngx-sonner';
import { Subject } from "rxjs";
import { AdminService } from "../../../../../services/admin/admin.service";
import { ScanningServer } from "../../../../../types";
import { takeUntil } from "rxjs/operators";
import { startPolling } from "../../../../../utils/polling.utils";

@Component({
  selector: 'app-detailserver',
  imports: [
    NgClass,
    RouterLink,
    TempladminComponent,
    SkeletonComponent
  ],
  templateUrl: './detailserver.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailserverComponent implements OnInit, OnDestroy {
  readonly isLoading = signal(true);
  readonly serverDetails = signal<ScanningServer | null>(null);
  readonly showIp = signal(false);
  serverId!: number;

  private unsubscribe$ = new Subject<void>();
  private pollingStop$ = new Subject<void>();
  protected readonly toast = toast;

  private route = inject(ActivatedRoute);
  private adminService = inject(AdminService);

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => {
        this.pollingStop$.next();
        this.serverId = +params['id'];
        startPolling(
          5000,
          this.pollingStop$,
          () => this.subscribeToServer(this.serverId)
        );
      });
  }

  ngOnDestroy(): void {
    this.pollingStop$.next();
    this.pollingStop$.complete();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private subscribeToServer(serverId: number): void {
    this.isLoading.set(true);
    this.adminService.getScanningProxyServersDetails(serverId).subscribe({
      next: (response) => {
        this.serverDetails.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toast.error("Error fetching server details");
        console.error("Error fetching server details:", error);
      }
    });
  }

  toggleIp(): void {
    this.showIp.update(value => !value);
  }

  getLoadBarColor(value: number): string {
    if (value < 40) return 'bg-green-500';
    if (value < 80) return 'bg-yellow-400';
    return 'bg-red-500';
  }
}
