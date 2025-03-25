import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { ApiResponse } from '../models/view-models/api-response.model';
import { CreateAuctionVM } from '../models/view-models/create-auction-vm.model';
import { AuctionVm } from '../models/view-models/auction-vm.model';
import { PaginatedApiResponse } from '../models/view-models/paginated-api-response.model';
import { AuctionStats } from '../models/view-models/auctions-stats-vm';
import { OwnerRankingVM } from '../models/view-models/owner-ranking-vm';

@Injectable({
  providedIn: 'root'
})
export class AuctionsService {
  private apiUrl = 'http://localhost:8080/api/auctions';

  constructor(private http: HttpClient) {}


  getOwnerRanking(duration: string, page: number, size: number): Observable<ApiResponse<PaginatedApiResponse<OwnerRankingVM>>> {
    let params = new HttpParams()
      .set('duration', duration)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PaginatedApiResponse<OwnerRankingVM>>>(`${this.apiUrl}/ranking`, { params });
  }

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
    startDate?: number,
    endDate?: number,
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

    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }
    
    
    if (minPrice !== null) {
      params = params.set('minPrice', minPrice.toString());
    }
    if (maxPrice !== null) {
      params = params.set('maxPrice', maxPrice.toString());
    }

    if (startDate !== undefined && startDate !== null) {
      params = params.set('startDate', startDate.toString());
    }
    if (endDate !== undefined && endDate !== null) {
      params = params.set('endDate', endDate.toString());
    }

    if (query) {
      params = params.set('q', query);
    }
    
    return this.http.get<ApiResponse<PaginatedApiResponse<AuctionVm>>>(`${this.apiUrl}`, { params });
  }

  
getUserWonAuctions(email: string, page: number, size: number): Observable<ApiResponse<PaginatedApiResponse<AuctionVm>>> {
  return this.http.get<ApiResponse<PaginatedApiResponse<AuctionVm>>>(`${this.apiUrl}/victories`, {
    params: {
      email: email,
      page: page.toString(),
      size: size.toString()
    }
  });
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
