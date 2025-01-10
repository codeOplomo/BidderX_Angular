import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  private apiUrl = 'http://localhost:8080/api/images';

  constructor(private http: HttpClient) {}

  uploadImage(image: File, folder: string): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('folder', folder);

    return this.http.post<{ data: string }>(`${this.apiUrl}/upload`, formData).pipe(
      map(response => ({
        imageUrl: this.getImageUrl(response.data)
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

  //  uploadImage(image: File, type: 'profile' | 'cover'): Observable<{ imageUrl: string }> {
    //   const formData = new FormData();
    //   formData.append('image', image);
    //   formData.append('type', type);
  
    //   return this.http.post<{ data: string }>(`${this.apiUrl}/upload-image`, formData).pipe(
    //     map(response => ({
    //       imageUrl: this.getImageUrlFromPath(response.data)
    //     }))
    //   );
    // }

}
