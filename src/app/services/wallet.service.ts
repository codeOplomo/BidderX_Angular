import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WalletVM } from '../models/view-models/wallet-vm';
import { DepositRequest } from '../models/view-models/deposit-request';
import { ConnectWalletRequest } from '../models/view-models/connect-wallet-request';
import { ApiResponse } from '../models/view-models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = 'http://localhost:8080/api/wallets';

  constructor(private http: HttpClient) { }

  connectWallet(request: ConnectWalletRequest): Observable<ApiResponse<WalletVM>> {
    return this.http.post<ApiResponse<WalletVM>>(`${this.apiUrl}/connect`, request);
  }

  getWallet(): Observable<ApiResponse<WalletVM>> {
    return this.http.get<ApiResponse<WalletVM>>(`${this.apiUrl}`);
  }
  depositFunds(request: DepositRequest): Observable<ApiResponse<WalletVM>> {
    return this.http.post<ApiResponse<WalletVM>>(`${this.apiUrl}/deposit`, request);
  }
}
