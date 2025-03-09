import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, filter, finalize, switchMap, take, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { RefreshTokenResponseVM } from '../models/view-models/refresh-token-response.model';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import * as AuthActions from '../store/auth/auth.actions';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const store = inject(Store);

  // Skip Authorization for login or refresh token requests
  if (req.url.includes('/api/auth/login') || req.url.includes('/api/auth/refresh-token')) {
    return next(req);
  }

  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return next(modifiedReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          // Check if we're already refreshing to prevent multiple refresh calls
          if (!authService.isRefreshing) {
            authService.isRefreshing = true;
            authService.refreshTokenSubject.next(null);

            return authService.refreshToken().pipe(
              switchMap((response: RefreshTokenResponseVM) => {
                authService.isRefreshing = false;
                authService.refreshTokenSubject.next(response.newAccessToken);

                // Retry the original request with new token
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.newAccessToken}`
                  }
                });
                return next(retryReq);
              }),
              catchError(refreshError => {
                authService.isRefreshing = false;
                store.dispatch(AuthActions.logout());
                return throwError(() => refreshError);
              }),
              finalize(() => {
                authService.isRefreshing = false;
              })
            );
          } else {
            // If refresh is in progress, wait for new token
            return authService.refreshTokenSubject.pipe(
              filter(token => token !== null),
              take(1),
              switchMap(token => {
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${token}`
                  }
                });
                return next(retryReq);
              })
            );
          }
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
