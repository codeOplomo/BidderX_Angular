import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImagesService } from './images.service';
import { Collection } from '../store/collections/collection.model';
import { ApiResponse } from '../models/view-models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  private apiUrl = 'http://localhost:8080/api/collections';

  constructor(private http: HttpClient, private imagesService: ImagesService) { }

  createCollection(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  getCollectionById(id: string): Observable<ApiResponse<Collection>> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
  uploadShowcaseCoverImage(image: File): Observable<{ imageUrl: string }> {
    return this.imagesService.uploadImage(image, 'collection-cover');
  }
}
