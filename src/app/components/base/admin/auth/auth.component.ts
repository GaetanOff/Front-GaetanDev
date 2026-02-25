import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { SsoService } from '../../../../services/sso/sso.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  loading = false;

  constructor(private ssoService: SsoService, private router: Router) {}

  ngOnInit(): void {
    if (this.ssoService.isAuthenticated) {
      this.router.navigate(['/admin']);
    }
  }

  async loginWithSSO(): Promise<void> {
    this.loading = true;
    toast.loading('Redirecting to SSO...');
    await this.ssoService.initiateLogin();
  }
}
