import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { ProductVm } from '../models/view-models/product-vm.model';
import { ApiResponse } from '../models/view-models/api-response.model';
import { ImagesService } from './images.service';
import { ProductVM } from '../models/view-models/product-vm';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient, private imagesService: ImagesService) {}

  getAvailableUserProductsByEmail(email: string): Observable<ApiResponse<ProductVm[]>> {
    const params = new HttpParams().set('email', email);
    return this.http.get<ApiResponse<ProductVm[]>>(`${this.apiUrl}/user`, { params });
  }

  createProduct(productData: ProductVM): Observable<ApiResponse<ProductVm>> {
    return this.http.post<ApiResponse<ProductVm>>(`${this.apiUrl}/create`, productData);
  }

  uploadProductImage(
    type: 'product-featured',
    productId: string,
    destroy$: Subject<void>,
    onSuccess: (imageUrl: string) => void,
    onLoadingChange: (loading: boolean) => void
  ): void {
    this.imagesService.openImageUploadDialog({
      type: type,
      productId: productId,
      onSuccess,
      onLoadingChange,
      onError: (error) => console.error('Error uploading product image:', error)
    }, destroy$);
  }
}
