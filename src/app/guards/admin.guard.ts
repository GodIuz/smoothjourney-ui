import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastService = inject(ToastService);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  const role = authService.getRoleFromToken()?.toLowerCase();

  if (role !== 'admin') {
    toastService.showError('Δεν έχετε δικαιώματα διαχειριστή.');
    router.navigate(['/mainapp/home']);
    return false;
  }
  return true;
};
