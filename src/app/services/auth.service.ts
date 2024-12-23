import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap, delay, switchMap } from 'rxjs/operators';
import { RegisterDataVM } from '../models/view-models/register-data.model';
import { RegisterResponseVM } from '../models/view-models/register-response.model';
import { VerifyDataVM } from '../models/view-models/verify-data.model';
import { TokenResponseVM } from '../models/view-models/token-response.model';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { Store } from '@ngrx/store';
import * as UserActions from '../store/user/user.actions';
  
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: any) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.getValue();
  }

  constructor(
    private http: HttpClient, 
    private store: Store
  ) {}

  initializeAuthState() {
    const hasToken = this.hasValidToken();
    this.isLoggedInSubject.next(hasToken);
    
    if (hasToken) {
      this.store.dispatch(UserActions.loadUserProfile());
    }
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  login(loginData: any) {
    return this.http.post<TokenResponseVM>(`${this.apiUrl}/login`, loginData).pipe(
      tap({
        next: (response) => {
          const { accessToken, refreshToken } = response;
          
          // Decode the accessToken to extract roles
          const decodedToken = this.decodeToken(accessToken);
          const roles = decodedToken?.roles || [];
          
          // Store tokens and roles in localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('userRoles', JSON.stringify(roles));
          
          // Update the logged-in state
          this.isLoggedInSubject.next(true);
        }
      }),
      tap(() => {
        this.store.dispatch(UserActions.loadUserProfile());
      })
    );
  }
  

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRoles');
    this.store.dispatch(UserActions.clearUserProfile());
    this.isLoggedInSubject.next(false);
  }

  checkAuthState(): boolean {
    return this.hasValidToken();
  }

  private checkTokenExists(): boolean {
    return !!localStorage.getItem('accessToken');
  }
  // Method to check if user has a specific role
  hasRole(role: string): boolean {
    const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    return roles.includes(`ROLE_${role}`);
  }

  register(registerDataVM: RegisterDataVM): Observable<RegisterResponseVM> {
    return this.http.post<RegisterResponseVM>(`${this.apiUrl}/register`, registerDataVM)
      .pipe(
        catchError(this.handleError)
      );
  }

  verifyUser(verifyDataVM: VerifyDataVM): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, verifyDataVM)
      .pipe(
        catchError(this.handleError)
      );
  }

  resendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-verification`, { email })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Generic error handler
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  // Method to decode JWT token
  private decodeToken(token: string): any {
    try {
      // Basic JWT decoding (note: this is a simplified version)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
  
  // private isValidToken(token: string): boolean {
  //   try {
  //     const decoded = this.decodeToken(token);
  //     return decoded && decoded.exp > Date.now() / 1000;
  //   } catch {
  //     return false;
  //   }
  // }
}