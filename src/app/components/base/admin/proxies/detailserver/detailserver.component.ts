import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {TempladminComponent} from "../../../../include/admin/templadmin/templadmin.component";
import {
  DetailsServerSkeletonsComponent
} from "../../../../include/skeletons/details-server-skeletons/details-server-skeletons.component";
import { toast } from 'ngx-sonner';
import {interval, Subject} from "rxjs";
import {AdminService} from "../../../../../services/admin/admin.service";
import {ScanningServer} from "../../../../../types";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-detailserver',
  imports: [
    NgClass,
    NgIf,
    RouterLink,
    TempladminComponent,
    DetailsServerSkeletonsComponent
  ],
  templateUrl: './detailserver.component.html'
})
export class DetailserverComponent {
  isLoading: boolean = true;
  serverId!: number;
  serverDetails : ScanningServer | null = null;
  showIp: boolean = false;
  private unsubscribe$ = new Subject<void>();
  protected readonly toast = toast;

  constructor(private route: ActivatedRoute, private adminService: AdminService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);

    this.route.params.subscribe(params => {
      this.serverId = +params['id'];
      this.subscribeToServer(this.serverId);
      interval(5000)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => this.subscribeToServer(this.serverId));
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private subscribeToServer(serverId: number): void {
    this.adminService.getScanningProxyServersDetails(serverId).subscribe({
      next: (response) => {
        this.serverDetails = response;
      },
      error: (error) => {
        this.toast.error("Error fetching server details");
        console.error("Error fetching server details:", error);
      }
    });
  }

  async toggleIp() {
    this.showIp = !this.showIp;
  }

  getLoadBarColor(value: number): string {
    if (value < 40) return 'bg-green-500';
    if (value < 80) return 'bg-yellow-400';
    return 'bg-red-500';
  }

}
