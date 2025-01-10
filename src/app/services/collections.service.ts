import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  private apiUrl = 'http://localhost:8080/api/collections';

  constructor(private http: HttpClient) { }

  createCollection(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  getCollectionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
}
