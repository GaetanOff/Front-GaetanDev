import { inject } from "@angular/core";
import { SsoService } from "../services/sso/sso.service";
import { Router } from "@angular/router";

export const AuthGuard = () => {
  const sso = inject(SsoService);
  const router = inject(Router);

  if (!sso.isAuthenticated) {
    router.navigate(['/admin/auth']);
    return false;
  }
  return true;
}
