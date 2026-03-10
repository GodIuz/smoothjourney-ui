import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  catchError,
  switchMap,
  throwError,
  BehaviorSubject,
  filter,
  take,
} from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');
  let clonedRequest = req;
  if (token) {
    clonedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/login')) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          document.dispatchEvent(new CustomEvent('token-refresh-start'));

          const currentRefreshToken = localStorage.getItem('refreshToken');

          if (currentRefreshToken) {
            return authService
              .refreshToken({ refreshToken: currentRefreshToken })
              .pipe(
                switchMap((response: any) => {
                  isRefreshing = false;
                  localStorage.setItem('token', response.token);
                  localStorage.setItem('refreshToken', response.refreshToken);
                  refreshTokenSubject.next(response.token);

                  document.dispatchEvent(new CustomEvent('token-refresh-end'));
                  const retryRequest = req.clone({
                    setHeaders: { Authorization: `Bearer ${response.token}` },
                  });
                  return next(retryRequest);
                }),
                catchError((refreshError) => {
                  isRefreshing = false;
                  document.dispatchEvent(new CustomEvent('token-refresh-end'));
                  authService.logout();
                  return throwError(() => refreshError);
                }),
              );
          }
        } else {
          return refreshTokenSubject.pipe(
            filter((newToken) => newToken !== null),
            take(1),
            switchMap((newToken) => {
              const retryRequest = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(retryRequest);
            }),
          );
        }
      }
      document.dispatchEvent(new CustomEvent('token-refresh-end'));
      return throwError(() => error);
    }),
  );
};
