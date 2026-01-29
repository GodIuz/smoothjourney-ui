import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role')?.toLowerCase(); 

  if (token && role === 'admin') {
    return true;
  } else {
    alert('Δεν έχετε δικαιώματα διαχειριστή!');
    router.navigate(['/login']); 
    return false;
  }
};