import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BidRequest } from '../models/view-models/bid-request';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/view-models/api-response.model';
import { BidVM } from '../models/view-models/bid-vm';

@Injectable({
  providedIn: 'root'
})
export class BidsService {

  private apiUrl = 'http://localhost:8080/api/bids';
  
    constructor(private http: HttpClient) {}

    placeBid(bid: BidRequest): Observable<ApiResponse<BidVM>> {
      return this.http.post<ApiResponse<BidVM>>(`${this.apiUrl}/place-bid`, bid);
    }
}
