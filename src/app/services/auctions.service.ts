import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
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


  searchAuctions(query: string, limit: number): Observable<AuctionVm[]> {
    return this.http.get<ApiResponse<AuctionVm[]>>(`${this.apiUrl}/search`, {
      params: { q: query, limit: limit.toString() }
    }).pipe(
      map(response => response.data)
    );
  }

  getAuctionsByFilter(
    categoryId: string | null,
    minPrice: number | null = null,
    maxPrice: number | null = null,
    status: string,
    type: string | null,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    page: number = 0,
    size: number = 8,
    query: string = ''
  ): Observable<ApiResponse<PaginatedApiResponse<AuctionVm>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sortOrder);
      
    if (status) {
      params = params.set('status', status);
    }

    if (type) {
      params = params.set('type', type);
    }

    // Add category filter if provided
    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }
    
    // Add price filters if provided
    if (minPrice !== null) {
      params = params.set('minPrice', minPrice.toString());
    }
    
    if (maxPrice !== null) {
      params = params.set('maxPrice', maxPrice.toString());
    }

    if (query) {
      params = params.set('q', query);
    }
    
    return this.http.get<ApiResponse<PaginatedApiResponse<AuctionVm>>>(`${this.apiUrl}`, { params });
  }

  getLiveAuctions(
    page: number = 0,
    size: number = 8
  ): Observable<ApiResponse<PaginatedApiResponse<AuctionVm>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    return this.http.get<ApiResponse<PaginatedApiResponse<AuctionVm>>>(`${this.apiUrl}/live`, { params });
  }

  getAuctionById(auctionId: string): Observable<ApiResponse<AuctionVm>> {
    return this.http.get<ApiResponse<AuctionVm>>(`${this.apiUrl}/${auctionId}`);
  }
  

  getAuctionsStats(): Observable<ApiResponse<AuctionStats>> {
    return this.http.get<ApiResponse<AuctionStats>>(`${this.apiUrl}/stats`);
  }

  getUserWonAuctionsByEmail(
    email: string,
    page: number = 0,
    size: number = 12
  ): Observable<ApiResponse<PaginatedApiResponse<AuctionVm>>> {
    const params = new HttpParams()
      .set('email', email)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PaginatedApiResponse<AuctionVm>>>(`${this.apiUrl}/victories`, { params });
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
