import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ImagesService } from './images.service';
import { Collection } from '../store/collections/collection.model';
import { ApiResponse } from '../models/view-models/api-response.model';
import { PaginatedApiResponse } from '../models/view-models/paginated-api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  private apiUrl = 'http://localhost:8080/api/collections';

  constructor(private http: HttpClient, private imagesService: ImagesService) { }


  removeProductFromCollection(collectionId: string, productId: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/${collectionId}/products/${productId}`);
  }
  
  addProductsToCollection(collectionId: string, productIds: string[]): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/${collectionId}/products`,  productIds );
  }
  
  getCollections(page: number = 0, size: number = 12): Observable<ApiResponse<PaginatedApiResponse<Collection>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PaginatedApiResponse<Collection>>>(`${this.apiUrl}`, { params });
  }
  

  createCollection(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  getCollectionById(id: string): Observable<ApiResponse<Collection>> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getCollectionsByEmail(
    email: string, 
    page: number = 0, 
    size: number = 12,
  ): Observable<ApiResponse<PaginatedApiResponse<Collection>>> {
    const params = new HttpParams()
      .set('email', email)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PaginatedApiResponse<Collection>>>(
      `${this.apiUrl}/user`, 
      { params }
    );
  }
  
  uploadShowcaseCoverImage(
    collectionId: string | null, 
    destroy$: Subject<void>,
    onSuccess: (imageUrl: string) => void,
    onLoadingChange: (loading: boolean) => void
  ) {
    if (!collectionId) {
      console.error('No collection ID available');
      return;
    }

     this.imagesService.openImageUploadDialog({
        type: 'collection-cover',
        collectionId: collectionId,
        onSuccess: (imageUrl) => onSuccess(imageUrl),
        onLoadingChange: (loading) => onLoadingChange(loading),
        onError: (error) => console.error('Error uploading image:', error)
      }, destroy$);
  }
  
}
