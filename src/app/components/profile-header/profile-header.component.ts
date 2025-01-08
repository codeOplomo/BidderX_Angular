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

  constructor(private userService: UserService, private authService: AuthService, private store: Store, private router: Router) {}

  getImageUrl(imagePath: string): string {
    return this.userService.getImageUrl(imagePath);
  }

  onUpdateProfilePicture() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
    
      fileInput.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          this.imageLoading = true;
          this.userService.uploadProfileImage(file).pipe(
            takeUntil(this.destroy$)
          ).subscribe({
            next: ({ imageUrl }) => {
              // Dispatch the action with the new image URL
              this.store.dispatch(UserActions.updateUserImageSuccess({ imageUrl }));
    
              // Trigger the action to load the full profile
              this.store.dispatch(UserActions.loadUserProfile());
              this.imageLoading = false;
            },
            error: (error) => {
              console.error('Upload failed:', error);
              this.imageLoading = false;
              this.store.dispatch(UserActions.updateUserImageFailure({ error }));
            }
          });
        }
      };
    
      fileInput.click();
    }

    onUpdateCoverPicture() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
    
      fileInput.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          this.imageLoading = true;
          this.userService.uploadCoverImage(file).pipe(
            takeUntil(this.destroy$)
          ).subscribe({
            next: ({ imageUrl }) => { // Use imageUrl for both profile and cover images
              this.store.dispatch(UserActions.updateUserImageSuccess({ imageUrl }));
              this.store.dispatch(UserActions.loadUserProfile());
              this.imageLoading = false;
            },
            error: (error) => {
              console.error('Upload failed:', error);
              this.imageLoading = false;
              this.store.dispatch(UserActions.updateUserImageFailure({ error }));
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
