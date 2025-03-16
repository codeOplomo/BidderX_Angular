import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BidRequest } from '../models/view-models/bid-request';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/view-models/api-response.model';
import { BidVM } from '../models/view-models/bid-vm';
import { PaginatedApiResponse } from '../models/view-models/paginated-api-response.model';

@Injectable({
  providedIn: 'root'
})
export class BidsService {

  private apiUrl = 'http://localhost:8080/api/bids';
  
    constructor(private http: HttpClient) {}

    placeBid(bid: BidRequest): Observable<ApiResponse<BidVM>> {
      return this.http.post<ApiResponse<BidVM>>(`${this.apiUrl}/place-bid`, bid);
    }

    getAllBids(auctionId: string, page: number = 0, size: number = 10): Observable<ApiResponse<PaginatedApiResponse<BidVM>>> {
      return this.http.get<ApiResponse<PaginatedApiResponse<BidVM>>>(
        `${this.apiUrl}/${auctionId}?page=${page}&size=${size}`
      );
    }
  
    // Fetch current user's bids for an auction
    getUserBids(auctionId: string, page: number = 0, size: number = 10): Observable<ApiResponse<PaginatedApiResponse<BidVM>>> {
      return this.http.get<ApiResponse<PaginatedApiResponse<BidVM>>>(
        `${this.apiUrl}/user/${auctionId}?page=${page}&size=${size}`
      );
    }
}
