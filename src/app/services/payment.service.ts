import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/stripe';

  constructor(private http: HttpClient) { }

  confirmPayment(sessionId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/confirm-payment?sessionId=${sessionId}`, {});
  }
  
}
