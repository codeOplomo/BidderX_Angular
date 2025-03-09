import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WalletVM } from '../models/view-models/wallet-vm';
import { DepositRequest } from '../models/view-models/deposit-request';
import { ConnectWalletRequest } from '../models/view-models/connect-wallet-request';
import { ApiResponse } from '../models/view-models/api-response.model';
import * as WalletActions from '../store/wallet/wallet.actions';
import { selectWalletBalance } from '../store/wallet/wallet.selectors';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = 'http://localhost:8080/api/wallets';

  constructor(private http: HttpClient, private store: Store) { }

  loadWallet() {
    this.store.dispatch(WalletActions.loadWallet());
  }

  getBalance(): Observable<number> {
    return this.store.select(selectWalletBalance);
  }
  
  connectWallet(request: ConnectWalletRequest): Observable<ApiResponse<WalletVM>> {
    return this.http.post<ApiResponse<WalletVM>>(`${this.apiUrl}/connect`, request);
  }

  depositFunds(request: DepositRequest): Observable<ApiResponse<WalletVM>> {
    return this.http.post<ApiResponse<WalletVM>>(`${this.apiUrl}/deposit`, request);
  }

  getWallet(): Observable<ApiResponse<WalletVM>> {
    return this.http.get<ApiResponse<WalletVM>>(`${this.apiUrl}`);
  }
}
