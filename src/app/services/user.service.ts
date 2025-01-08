import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { PasswordUpdateVM } from '../models/view-models/password-update.model';
import { ProfileUpdateVM } from '../models/view-models/profile-update.model';
import { ApiResponse } from '../models/view-models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }


  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`).pipe(
      map(profile => ({
        ...profile,
        imageUrl: this.getImageUrl(profile.imageUrl), // Correct method call
      }))
    );
  }
  

  getImageUrl(imagePath: string): string {
    return this.getImageUrlFromPath(imagePath); 
  }

  private getImageUrlFromPath(relativePath: string | null): string {
    const baseUrl = 'http://localhost:8080';
    if (relativePath && !relativePath.startsWith(baseUrl)) {
      return `${baseUrl}${relativePath}`;
    }
    return relativePath || 'assets/images/default-avatar.png'; 
  }
  

  uploadProfileImage(image: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', image);
  
    return this.http.post<{ data: string }>(`${this.apiUrl}/upload-image`, formData).pipe(
      map(response => ({
        imageUrl: this.getImageUrlFromPath(response.data)
      }))
    );
  }

  
  uploadCoverImage(image: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', image);
  
    return this.http.post<{ data: string }>(`${this.apiUrl}/upload-cover-image`, formData).pipe(
      map(response => ({
        imageUrl: this.getImageUrlFromPath(response.data)
      }))
    );
  }

  
  
  
  updateProfile(profileUpdateVM: ProfileUpdateVM): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit-profile`, profileUpdateVM);
  }

  updatePassword(passwordUpdateVM: PasswordUpdateVM): Observable<any> {
    return this.http.put(`${this.apiUrl}/change-password`, passwordUpdateVM);
  }

}
