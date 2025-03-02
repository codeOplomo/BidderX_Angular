import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WalletVM } from '../models/view-models/wallet-vm';
import { DepositRequest } from '../models/view-models/deposit-request';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = 'http://localhost:8080/api/wallets';

  constructor(private http: HttpClient) { }

  depositFunds(amount: number): Observable<WalletVM> {
    const request: DepositRequest = { amount };
    return this.http.post<WalletVM>(`${this.apiUrl}/deposit`, request);
  }

  getWallet(): Observable<WalletVM> {
    return this.http.get<WalletVM>(`${this.apiUrl}`);
  }
}
