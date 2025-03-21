import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap, delay, switchMap } from 'rxjs/operators';
import { RegisterDataVM } from '../models/view-models/register-data.model';
import { RegisterResponseVM } from '../models/view-models/register-response.model';
import { VerifyDataVM } from '../models/view-models/verify-data.model';
import { TokenResponseVM } from '../models/view-models/token-response.model';
import { Store } from '@ngrx/store';
import * as UserActions from '../store/user/user.actions';
import { RefreshTokenResponseVM } from '../models/view-models/refresh-token-response.model';
import { RefreshTokenRequestVM } from '../models/view-models/refresh-token-request.model';
  

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  // Only responsible for API calls
  login(credentials: { email: string; password: string }): Observable<TokenResponseVM> {
    return this.http.post<TokenResponseVM>(`${this.apiUrl}/login`, credentials);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {});
  }

  refreshToken(): Observable<RefreshTokenResponseVM> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('Refresh token not found'));
    }
    const refreshTokenRequest: RefreshTokenRequestVM = { refreshToken };
    return this.http.post<RefreshTokenResponseVM>(`${this.apiUrl}/refresh-token`, refreshTokenRequest);
  }

  register(registerDataVM: RegisterDataVM): Observable<RegisterResponseVM> {
    return this.http.post<RegisterResponseVM>(`${this.apiUrl}/register`, registerDataVM)
      .pipe(catchError(this.handleError));
  }

  verifyUser(verifyDataVM: VerifyDataVM): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, verifyDataVM)
      .pipe(catchError(this.handleError));
  }

  resendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-verification`, { email })
      .pipe(catchError(this.handleError));
  }

  // Public helper for decoding JWT tokens
  public decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

// @Injectable({
//   providedIn: 'root'
// })

// export class AuthService {
//   private apiUrl = 'http://localhost:8080/api/auth';
//   private isLoggedInSubject = new BehaviorSubject<boolean>(false);
//   isLoggedIn$ = this.isLoggedInSubject.asObservable();
//   private userSubject = new BehaviorSubject<any>(null);
//   user$ = this.userSubject.asObservable();
//   isRefreshing = false;
//   refreshTokenSubject = new BehaviorSubject<string | null>(null);

//   constructor(
//     private http: HttpClient, 
//     private store: Store
//   ) {}
//   setUser(user: any) {
//     this.userSubject.next(user);
//   }

//   getUser() {
//     return this.userSubject.getValue();
//   }


//   initializeAuthState() {
//     const hasToken = this.hasValidToken();
//     this.isLoggedInSubject.next(hasToken);
    
//     if (hasToken) {
//       this.store.dispatch(UserActions.loadUserProfile());
//     }
//   }

//   setLoggedInStatus(status: boolean) {
//     this.isLoggedInSubject.next(status);
//   }
  
//   private hasValidToken(): boolean {
//     const token = localStorage.getItem('accessToken');
//     if (!token) return false;
    
//     return true;
//   }

//   login(credentials: { email: string; password: string }): Observable<TokenResponseVM> {
//     // Only make API call, remove all side effects
//     return this.http.post<TokenResponseVM>(`${this.apiUrl}/login`, credentials);
//   }
  
//   logout(): Observable<void> {
//     // Only make the API call here
//     return this.http.post<void>(`${this.apiUrl}/logout`, {});
//   }

//   checkAuthState(): boolean {
//     return this.hasValidToken();
//   }

//   // Method to check if user has a specific role
//   hasRole(role: string): boolean {
//     const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
//     return roles.includes(`ROLE_${role}`);
//   }
  
//   refreshToken(): Observable<RefreshTokenResponseVM> {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (!refreshToken) {
//       return throwError(() => new Error('Refresh token not found'));
//     }

//     const refreshTokenRequest: RefreshTokenRequestVM = {
//       refreshToken
//     };

//     return this.http.post<RefreshTokenResponseVM>(`${this.apiUrl}/refresh-token`, refreshTokenRequest)
//       .pipe(
//         tap((response: RefreshTokenResponseVM) => {
//           // Update access token in localStorage
//           localStorage.setItem('accessToken', response.newAccessToken);
          
//           // Update auth state
//           this.isLoggedInSubject.next(true);
          
//           // Reload user profile after successful token refresh
//           this.store.dispatch(UserActions.loadUserProfile());
//         }),
//         catchError((error) => {
//           this.logout();
//           return throwError(() => error);
//         })
//       );
//   }
  


//   register(registerDataVM: RegisterDataVM): Observable<RegisterResponseVM> {
//     return this.http.post<RegisterResponseVM>(`${this.apiUrl}/register`, registerDataVM)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   verifyUser(verifyDataVM: VerifyDataVM): Observable<any> {
//     return this.http.post(`${this.apiUrl}/verify`, verifyDataVM)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   resendVerificationCode(email: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/resend-verification`, { email })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   // Generic error handler
//   private handleError(error: HttpErrorResponse) {
//     let errorMessage = 'An unknown error occurred!';

//     if (error.error instanceof ErrorEvent) {
//       // Client-side error
//       errorMessage = `Error: ${error.error.message}`;
//     } else {
//       // Server-side error
//       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
//     }

//     console.error(errorMessage);
//     return throwError(() => new Error(errorMessage));
//   }
//   // Method to decode JWT token
//   private decodeToken(token: string): any {
//     try {
//       // Basic JWT decoding (note: this is a simplified version)
//       const base64Url = token.split('.')[1];
//       const base64 = base64Url.replace('-', '+').replace('_', '/');
//       return JSON.parse(window.atob(base64));
//     } catch (error) {
//       console.error('Error decoding token', error);
//       return null;
//     }
//   }
  
// }