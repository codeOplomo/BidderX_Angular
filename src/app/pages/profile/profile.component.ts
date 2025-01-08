import { Component, OnDestroy, OnInit } from '@angular/core';
import { RatingModule } from 'primeng/rating';
import { TabPanel, TabViewModule } from 'primeng/tabview';
import { TabsModule } from 'primeng/tabs';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule, HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { SplitButton, SplitButtonModule } from 'primeng/splitbutton';
import { CommonModule, NgIf } from '@angular/common';
import { combineLatest, EMPTY, filter, map, Observable, Subject, take, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import * as UserActions from '../../store/user/user.actions';
import { selectUser } from '../../store/user/user.selectors';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { MenuItem } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { ProfileHeaderComponent } from '../../components/profile-header/profile-header.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    CommonModule,
    FormsModule,
    CardModule,
    MenuModule,
    HttpClientModule,
    ButtonModule,
    NgIf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  rating: number = 5;
  user$: Observable<any>;
  imageLoading = false;

  errorMessage: string = '';

  
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private store: Store,
    private router: Router,
  ) {
    // Initialize user$ in constructor
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit() {
    if (this.authService.checkAuthState()) {
      this.user$ = this.store.select(selectUser);
    }
    this.user$.subscribe(user => console.log(user));

  }

  updateProfile(profileData: any) {
    this.store.dispatch(UserActions.updateUserProfile({ profileData }));
  }

  getImageUrl(imagePath: string): string {
    return this.userService.getImageUrl(imagePath);
  }
  
  updateProfileImage(file: File) {
  this.store.dispatch(UserActions.updateUserImage({ imageFile: file }));
}



  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isOwner(): boolean {
    return this.authService.hasRole('OWNER');
  }


  onCreateCollection() {
    this.router.navigate(['/create-collection']);
  }

  onCreateAuction() {
    this.router.navigate(['/create-auction']);
  }
}
