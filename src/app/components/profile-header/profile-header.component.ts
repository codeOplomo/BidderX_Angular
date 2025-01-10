import { Component, Input, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import * as UserActions from '../../store/user/user.actions';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [SplitButtonModule, TagModule, RatingModule, CommonModule, FormsModule, ButtonModule],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css'
})
export class ProfileHeaderComponent implements OnDestroy {
  @Input() user$?: Observable<any>;
  @Input() rating?: number;
  @Input() imageLoading?: boolean;
  @Input() coverImageLoading = false;

  editItems: any[] = [
    {
      label: 'Edit Profile',
      icon: 'pi pi-pencil',
      command: () => this.onEditProfile()
    },
    {
      label: 'Edit Password',
      icon: 'pi pi-lock',
      command: () => this.onEditPassword()
    }
  ];
  private destroy$ = new Subject<void>();

  constructor(private imageService: ImagesService, private userService: UserService, private authService: AuthService, private store: Store, private router: Router) {}

  getImageUrl(imagePath: string): string {
    return this.imageService.getImageUrl(imagePath);
  }

  onUpdateProfilePicture() {
    this.handleImageUpload('profile');
  }

  onUpdateCoverPicture() {
    this.handleImageUpload('cover');
  }

  private handleImageUpload(type: 'profile' | 'cover') {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        if (type === 'profile') {
          this.imageLoading = true;
        } else {
          this.coverImageLoading = true;
        }

        const uploadMethod = type === 'profile' 
          ? this.userService.uploadProfileImage(file)
          : this.userService.uploadCoverImage(file);

        uploadMethod.pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: ({ imageUrl }) => {
            // Dispatch the appropriate action based on the type
            const action = type === 'profile'
              ? UserActions.updateUserImageSuccess({ imageUrl })
              : UserActions.updateUserCoverImageSuccess({ coverImageUrl: imageUrl });
            
            this.store.dispatch(action);
            this.store.dispatch(UserActions.loadUserProfile());
            
            if (type === 'profile') {
              this.imageLoading = false;
            } else {
              this.coverImageLoading = false;
            }
          },
          error: (error) => {
            console.error('Upload failed:', error);
            if (type === 'profile') {
              this.imageLoading = false;
              this.store.dispatch(UserActions.updateUserImageFailure({ error }));
            } else {
              this.coverImageLoading = false;
              this.store.dispatch(UserActions.updateUserCoverImageFailure({ error }));
            }
          }
        });
      }
    };

    fileInput.click();
  }
    

    onEditProfile() {
      this.router.navigate(['/edit-profile']);
    }
  
    onEditPassword() {
      this.router.navigate(['/edit-password']);
    }
  
  isOwner(): boolean {
    return this.authService.hasRole('OWNER');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
