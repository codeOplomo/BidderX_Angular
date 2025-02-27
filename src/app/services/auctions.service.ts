import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ApiResponse } from '../models/view-models/api-response.model';
import { CreateAuctionVM } from '../models/view-models/create-auction-vm.model';
import { AuctionVm } from '../models/view-models/auction-vm.model';
import { PaginatedApiResponse } from '../models/view-models/paginated-api-response.model';
import { AuctionStats } from '../models/view-models/auctions-stats-vm';

@Injectable({
  providedIn: 'root'
})
export class AuctionsService {
  private apiUrl = 'http://localhost:8080/api/auctions';

  constructor(private http: HttpClient) {}

  getAuctionsStats(): Observable<ApiResponse<AuctionStats>> {
    return this.http.get<ApiResponse<AuctionStats>>(`${this.apiUrl}/stats`);
  }

  
  getPendingAuctions(page: number = 0, size: number = 10): Observable<ApiResponse<PaginatedApiResponse<AuctionVm>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PaginatedApiResponse<AuctionVm>>>(`${this.apiUrl}/pending`, { params });
  }

  approveAuction(auctionId: string): Observable<ApiResponse<AuctionVm>> {
    return this.http.put<ApiResponse<AuctionVm>>(
      `${this.apiUrl}/${auctionId}/approve`, 
      {}
    );
  }

  rejectAuction(auctionId: string, reason: string): Observable<ApiResponse<AuctionVm>> {
    return this.http.put<ApiResponse<AuctionVm>>(
      `${this.apiUrl}/${auctionId}/reject`,
      { reason }
    );
  }
  
  createAuction(formData: FormData): Observable<ApiResponse<AuctionVm>> {
    return this.http.post<ApiResponse<AuctionVm>>(`${this.apiUrl}/create`, formData);
  }

  getUserAuctionsByEmail(
    email: string,
    page: number = 0,
    size: number = 12
  ): Observable<ApiResponse<PaginatedApiResponse<AuctionVm>>> {
    const params = new HttpParams()
      .set('email', email)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PaginatedApiResponse<AuctionVm>>>(`${this.apiUrl}/user`, { params });
  }


  getUserLikedAuctionsByEmail(
    email: string,
    page: number = 0,
    size: number = 12
  ): Observable<ApiResponse<PaginatedApiResponse<AuctionVm>>> {
    const params = new HttpParams()
      .set('email', email)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PaginatedApiResponse<AuctionVm>>>(`${this.apiUrl}/liked`, { params });
  }
}
