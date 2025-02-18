import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import * as CollectionActions from '../store/collections/collection.actions';
import * as UserActions from '../store/user/user.actions';
import { ImageType, ImageUploadConfig } from '../models/enums/image-upload.types';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  private apiUrl = 'http://localhost:8080/api/images';

  constructor(private http: HttpClient, private store: Store) {}

  uploadImage(image: File, type: string, collectionId?: string, productId?: string): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('type', type);
    if (collectionId) {
      formData.append('collectionId', collectionId);
    }
    if (productId) {
      formData.append('productId', productId);
    }

    return this.http.post<{ data: string }>(`${this.apiUrl}/upload`, formData).pipe(
      map(response => ({
        imageUrl: this.getImageUrl(response.data),
        collectionId,
        productId
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

  openImageUploadDialog(config: ImageUploadConfig, destroy$: Subject<void>) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      config.onLoadingChange?.(true);

      this.uploadImage(file, config.type, config.collectionId).pipe(
        takeUntil(destroy$)
      ).subscribe({
        next: ({ imageUrl }) => {
          this.dispatchSuccessAction(config.type, imageUrl, config.collectionId);
          config.onSuccess?.(imageUrl);
          config.onLoadingChange?.(false);
        },
        error: (error) => {
          this.dispatchFailureAction(config.type, error);
          config.onError?.(error);
          config.onLoadingChange?.(false);
        }
      });
    };

    fileInput.click();
  }

  private dispatchSuccessAction(type: ImageType, imageUrl: string, collectionId?: string) {
    switch (type) {
      case 'profile':
        this.store.dispatch(UserActions.updateUserImageSuccess({ imageUrl }));
        this.store.dispatch(UserActions.loadUserProfile());
        break;
      case 'cover':
        this.store.dispatch(UserActions.updateUserCoverImageSuccess({ coverImageUrl: imageUrl }));
        this.store.dispatch(UserActions.loadUserProfile());
        break;
      case 'collection-cover':
        if (collectionId) {
          this.store.dispatch(CollectionActions.updateCollectionCoverImageSuccess({ 
            imageUrl,
            collectionId 
          }));
          // Optionally reload the collection after updating the image
          // this.store.dispatch(CollectionActions.loadCollection({ id: collectionId }));
        }
        break;
    }
  }

  private dispatchFailureAction(type: ImageType, error: any) {
    switch (type) {
      case 'profile':
        this.store.dispatch(UserActions.updateUserImageFailure({ error }));
        break;
      case 'cover':
        this.store.dispatch(UserActions.updateUserCoverImageFailure({ error }));
        break;
      case 'collection-cover':
        this.store.dispatch(CollectionActions.updateCollectionCoverImageFailure({ error }));
        break;
    }
  }

}
