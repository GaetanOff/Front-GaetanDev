import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { SsoService } from "../services/sso/sso.service";

export const AuthGuard: CanActivateFn = async () => {
  const sso = inject(SsoService);
  const router = inject(Router);

  if (await sso.ensureAuthenticated()) {
    return true;
  }

  await router.navigate(['/admin/auth']);
  return false;
};
