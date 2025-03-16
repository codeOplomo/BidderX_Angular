import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { ProductVm } from '../models/view-models/product-vm.model';
import { ApiResponse } from '../models/view-models/api-response.model';
import { ImagesService } from './images.service';
import { ProductVM } from '../models/view-models/product-vm';
import { PaginatedApiResponse } from '../models/view-models/paginated-api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient, private imagesService: ImagesService) {}

  createProduct(formData: FormData): Observable<ApiResponse<ProductVM>> {
    return this.http.post<ApiResponse<ProductVM>>(this.apiUrl, formData);
  }

  getProductById(id: string): Observable<ApiResponse<ProductVM>> {
    return this.http.get<ApiResponse<ProductVM>>(`${this.apiUrl}/${id}`);
  }

  getAvailableUserProductsByEmail(email: string, page: number = 0, size: number = 12,): Observable<ApiResponse<PaginatedApiResponse<ProductVM>>> {
    const params = new HttpParams()
      .set('email', email)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PaginatedApiResponse<ProductVM>>>(`${this.apiUrl}/user`, { params });
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
