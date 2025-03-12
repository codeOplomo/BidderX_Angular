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
          // Call refreshToken() directly (without using internal flags)
          return authService.refreshToken().pipe(
            switchMap((response: RefreshTokenResponseVM) => {
              // Update access token in localStorage
              localStorage.setItem('accessToken', response.newAccessToken);

              // Retry the original request with the new token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.newAccessToken}`
                }
              });
              return next(retryReq);
            }),
            catchError(refreshError => {
              // If refresh fails, dispatch a logout action to clear state
              store.dispatch(AuthActions.logout());
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
