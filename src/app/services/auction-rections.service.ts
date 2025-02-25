import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LikeStatusVM } from '../models/view-models/like-status-vm';
import { ApiResponse } from '../models/view-models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuctionRectionsService {
  private apiUrl = 'http://localhost:8080/api/auction-reactions';

  constructor(private http: HttpClient) {}

  
  toggleLike(auctionId: string): Observable<ApiResponse<LikeStatusVM>> {
    return this.http.post<ApiResponse<LikeStatusVM>>(`${this.apiUrl}/${auctionId}/like`, {});
  }
}
