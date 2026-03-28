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
  const token = authService.getToken();

  let clonedRequest = req;
  if (token) {
    clonedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        !req.url.includes('/login') &&
        !req.url.includes('/refresh-token')
      ) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);
          const currentRefreshToken =
            localStorage.getItem('refreshToken') ||
            sessionStorage.getItem('refreshToken') ||
            '';

          return authService
            .refreshToken({ refreshToken: currentRefreshToken })
            .pipe(
              switchMap((response: any) => {
                isRefreshing = false;

                if (localStorage.getItem('token')) {
                  localStorage.setItem(
                    'token',
                    response.token || response.accessToken,
                  );
                  localStorage.setItem('refreshToken', response.refreshToken);
                } else {
                  sessionStorage.setItem(
                    'token',
                    response.token || response.accessToken,
                  );
                  sessionStorage.setItem('refreshToken', response.refreshToken);
                }
                const newToken = response.token || response.accessToken;
                refreshTokenSubject.next(newToken);
                const retryRequest = req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` },
                });
                return next(retryRequest);
              }),
              catchError((refreshError) => {
                isRefreshing = false;
                authService.logout();
                return throwError(() => refreshError);
              }),
            );
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

      return throwError(() => error);
    }),
  );
};
