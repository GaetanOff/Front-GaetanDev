import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { SsoService } from '../../../../../services/sso/sso.service';

@Component({
  selector: 'app-sso-callback',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="text-center">
        <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-400 border-r-transparent mb-4"></div>
        <p class="text-white text-lg">Authenticating...</p>
      </div>
    </div>
  `,
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ssoService: SsoService,
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (error) {
      toast.error(`Authentication failed: ${error}`);
      this.router.navigate(['/admin/auth']);
      return;
    }

    if (!code || !state) {
      toast.error('Invalid callback: missing code or state');
      this.router.navigate(['/admin/auth']);
      return;
    }

    this.ssoService.handleCallback(code, state).subscribe({
      next: (success) => {
        if (success) {
          toast.success('Successfully connected.');
          this.router.navigate(['/admin']);
        } else {
          toast.error('Authentication failed.');
          this.router.navigate(['/admin/auth']);
        }
      },
      error: (err) => {
        toast.error(err.message || 'Authentication failed.');
        this.router.navigate(['/admin/auth']);
      },
    });
  }
}
