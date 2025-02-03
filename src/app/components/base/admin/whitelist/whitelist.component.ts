import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdminService} from '../../../../services/admin/admin.service';
import { toast } from 'ngx-sonner';
import {interval, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-whitelist',
  templateUrl: './whitelist.component.html'
})
export class WhitelistComponent implements OnInit, OnDestroy {
  protected readonly toast = toast;

  address: string | undefined;
  server: number | undefined;
  whitelistedIPs: string[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(private adminService: AdminService) {
  }

  ngOnInit(): void {
    this.adminService.checkAdmin();
    this.updateWhitelistedIPs();

    interval(60000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.updateWhitelistedIPs());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  processForm() {
    if (!this.address) {
      this.toast.error("Invalid form");
      return;
    }

    this.adminService.addWhitelistedIP(this.address).subscribe(() => {
      this.toast.success('IP whitelisted');
      if (this.address != null) this.whitelistedIPs.push(this.address);
    });
  }

  removeWhitelistedIP(ip: string) {
    this.adminService.removeWhitelistedIP(ip).subscribe(() => {
      this.toast.success('IP removed from whitelist');
      this.whitelistedIPs = this.whitelistedIPs.filter((value: string) => value !== ip);
    });
  }

  private updateWhitelistedIPs() {
    this.adminService.getWhitelistedIPs().subscribe(
      (response: any) => {
        this.whitelistedIPs = response;
      },
      (error: any) => {
        this.toast.error("Error fetching whitelisted IPs");
        console.error('Error fetching whitelisted IPs:', error);
      }
    );
  }
}
