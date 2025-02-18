import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ApiResponse } from '../models/view-models/api-response.model';
import { CreateAuctionVM } from '../models/view-models/create-auction-vm.model';
import { AuctionVm } from '../models/view-models/auction-vm.model';

@Injectable({
  providedIn: 'root'
})
export class AuctionsService {
  private apiUrl = 'http://localhost:8080/api/auctions';

  constructor(private http: HttpClient) {}

  createAuction(formData: FormData): Observable<ApiResponse<AuctionVm>> {
    return this.http.post<ApiResponse<AuctionVm>>(`${this.apiUrl}/create`, formData);
  }

}
