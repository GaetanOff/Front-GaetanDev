import { inject } from "@angular/core";
import { AdminService } from "../services/admin/admin.service";
import { Router } from "@angular/router";

export const AuthGuard = () => {
  const auth = inject(AdminService);
  const router = inject(Router);

  if (!auth.isLogged) {
    router.navigate(['/admin/auth']).then(() => console.log('Navigated to admin/auth'));
    return false;
  }
  return true;
}
