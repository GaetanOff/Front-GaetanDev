import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdminService} from '../../../../services/admin/admin.service';
import {NotifierService} from 'angular-notifier';
import {interval, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-whitelist',
  templateUrl: './whitelist.component.html'
})
export class WhitelistComponent implements OnInit, OnDestroy {
  address: string | undefined;
  server: number | undefined;
  whitelistedIPs: string[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(private adminService: AdminService, private notifierService: NotifierService) {
  }

  ngOnInit(): void {
    this.adminService.checkAdmin();
    this.updateWhitelistedIPs();

    interval(3000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.updateWhitelistedIPs());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  processForm() {
    if (!this.address) {
      this.notifierService.notify('error', 'Invalid form');
      return;
    }

    this.adminService.addWhitelistedIP(this.address).subscribe(() => {
      this.notifierService.notify('success', 'IP whitelisted');
      if (this.address != null) this.whitelistedIPs.push(this.address);
    });
  }

  removeWhitelistedIP(ip: string) {
    this.adminService.removeWhitelistedIP(ip).subscribe(() => {
      this.notifierService.notify('success', 'IP removed from whitelist');
      this.whitelistedIPs = this.whitelistedIPs.filter((value: string) => value !== ip);
    });
  }

  private updateWhitelistedIPs() {
    this.adminService.getWhitelistedIPs().subscribe(
      (response: any) => {
        this.whitelistedIPs = response;
      },
      (error: any) => {
        this.notifierService.notify('error', 'Error fetching whitelisted IPs');
        console.error('Error fetching whitelisted IPs:', error);
      }
    );
  }
}
