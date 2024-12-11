import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

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