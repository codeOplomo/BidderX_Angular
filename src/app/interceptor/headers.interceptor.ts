import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { RefreshTokenRequestVM } from '../models/view-models/refresh-token-request.model';
import { RefreshTokenResponseVM } from '../models/view-models/refresh-token-response.model';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // Skip Authorization for login request
  if (req.url.includes('/api/auth/login')) {
    return next(req);
  }

  if (accessToken) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return next(modifiedReq).pipe(
      catchError(error => {
        if (error.status === 401 && refreshToken) {
          const refreshTokenRequest: RefreshTokenRequestVM = {
            refreshToken: refreshToken
          };
          // Attempt to refresh the token
          return http.post<RefreshTokenResponseVM>('/api/auth/refresh-token', refreshTokenRequest).pipe(
            switchMap((response: RefreshTokenResponseVM) => {
              // Update tokens in localStorage
              localStorage.setItem('accessToken', response.newAccessToken);

              // Retry the original request with the new access token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.newAccessToken}`
                }
              });

              return next(retryReq);  // Retry the original request with new token
            }),
            catchError(refreshError => {
              // Handle refresh token failure
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              router.navigate(['/login']);
              return throwError(refreshError);
            })
          );
        }
        return throwError(error);
      })
    );
  }

  return next(req);
};
