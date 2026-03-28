import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    const requiredRoles = route.data?.['roles'] as string[];
    if (requiredRoles) {
      const userRole = authService.getRoleFromToken();
      if (!requiredRoles.includes(userRole)) {
        router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
