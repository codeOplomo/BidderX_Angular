import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ApiResponse } from '../models/view-models/api-response.model';
import { CreateAuctionVm } from '../models/view-models/create-auction-vm.model';
import { AuctionVm } from '../models/view-models/auction-vm.model';

@Injectable({
  providedIn: 'root'
})
export class AuctionsService {
  private apiUrl = 'http://localhost:8080/api/auctions';

  constructor(private http: HttpClient) {}

  createProduct(productData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/create`, productData);
  }

  createAuction(request: CreateAuctionVm): Observable<ApiResponse<AuctionVm>> {
    return this.http.post<ApiResponse<AuctionVm>>(`${this.apiUrl}/create`, request);
  }

  createAuctionWithNewProduct(data: any): Observable<any> {
    const productData = {
      title: data.productTitle,
      description: data.productDescription,
      condition: data.condition,
      manufacturer: data.manufacturer,
      productionDate: data.productionDate,
      imageUrl: data.productImage
    };
  
    return this.createProduct(productData).pipe(
      switchMap(product => {
        const auctionData: CreateAuctionVm = {
          title: data.title,
          description: data.description,
          startTime: data.startTime,
          startingPrice: data.startingPrice,
          isInstantAuction: data.isInstantAuction || false, // Default to false if not provided
          auctionDurationInHours: data.auctionDurationInHours || 24 // Default to 24 hours if not provided
        };
        return this.createAuction(auctionData);
      })
    );
  }
}
