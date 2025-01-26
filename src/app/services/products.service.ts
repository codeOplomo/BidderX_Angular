import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductVm } from '../models/view-models/product-vm.model';
import { ApiResponse } from '../models/view-models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getAvailableUserProductsByEmail(email: string): Observable<ApiResponse<ProductVm[]>> {
    const params = new HttpParams().set('email', email);
    return this.http.get<ApiResponse<ProductVm[]>>(`${this.apiUrl}/user/available`, { params });
  }
}
