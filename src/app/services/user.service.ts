import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';
import { PasswordUpdateVM } from '../models/view-models/password-update.model';
import { ProfileUpdateVM } from '../models/view-models/profile-update.model';
import { ApiResponse } from '../models/view-models/api-response.model';
import { ImagesService } from './images.service';
import { ProfileVM } from '../models/view-models/profile';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient, private imagesService: ImagesService) { }


  getProfile(): Observable<ApiResponse<ProfileVM>> {
    return this.http.get<ApiResponse<ProfileVM>>(`${this.apiUrl}/profile`).pipe(
      map(response => ({
        ...response,
        data: {
          ...response.data,
          imageUrl: this.imagesService.getImageUrl(response.data.imageUrl),
          coverImageUrl: response.data.coverImageUrl
            ? this.imagesService.getImageUrl(response.data.coverImageUrl)
            : undefined,
          collections: response.data.collections || [],
        }
      }))
    );
  }

  getProfileByEmail(email: string): Observable<ApiResponse<ProfileVM>> {
    return this.http.get<ApiResponse<ProfileVM>>(`${this.apiUrl}/${email}/profile`).pipe(
      map(response => ({
        ...response,
        data: {
          ...response.data,
          imageUrl: this.imagesService.getImageUrl(response.data.imageUrl),
          coverImageUrl: response.data.coverImageUrl
            ? this.imagesService.getImageUrl(response.data.coverImageUrl)
            : undefined,
          collections: response.data.collections || [],
        }
      }))
    );
  }
  
  
  
  

  uploadProfileImage(destroy$: Subject<void>, onSuccess: (imageUrl: string) => void, onLoadingChange: (loading: boolean) => void) {
    this.imagesService.openImageUploadDialog({
      type: 'profile',
      onSuccess,
      onLoadingChange,
    }, destroy$);
  }
  
  uploadCoverImage(destroy$: Subject<void>, onSuccess: (imageUrl: string) => void, onLoadingChange: (loading: boolean) => void) {
    this.imagesService.openImageUploadDialog({
      type: 'cover',
      onSuccess,
      onLoadingChange,
    }, destroy$);
  }
  
  updateProfile(profileUpdateVM: ProfileUpdateVM): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit-profile`, profileUpdateVM);
  }

  updatePassword(passwordUpdateVM: PasswordUpdateVM): Observable<any> {
    return this.http.put(`${this.apiUrl}/change-password`, passwordUpdateVM);
  }

}
