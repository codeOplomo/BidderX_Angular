import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Interface for registration response
export interface RegisterResponse {
  message: string;
  email: string;
}

// Interface for registration data
export interface RegisterData {
  email: string;
  password: string;
  profileIdentifier: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

// Interface for verification data
export interface VerifyData {
  email: string;
  verificationCode: string;
}

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkTokenExists());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  private checkTokenExists(): boolean {
    return !!localStorage.getItem('token');
  }
  register(registerData: RegisterData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, registerData)
      .pipe(
        catchError(this.handleError)
      );
  }

  verifyUser(verifyData: VerifyData): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, verifyData)
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

  login(loginData: { email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            // Update login status
            this.isLoggedInSubject.next(true);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    // Update login status
    this.isLoggedInSubject.next(false);
  }

  getProfile
    (): Observable<any> {
    // Set up headers with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<any>(`${this.apiUrl}/profile`, { headers })
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
}