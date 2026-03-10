import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role')?.toLowerCase();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  if (role !== 'admin') {
    toastService.showError('Δεν έχετε δικαιώματα διαχειριστή.');
    router.navigate(['/mainapp/home']);
    return false;
  }

  return true;
};
