import { Component, OnDestroy, OnInit } from '@angular/core';
import { RatingModule } from 'primeng/rating';
import { TabsModule } from 'primeng/tabs';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { SplitButton, SplitButtonModule } from 'primeng/splitbutton';
import { NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { combineLatest, EMPTY, filter, Subject, take, takeUntil } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RatingModule,
    TabsModule,
    FormsModule,
    SplitButton,
    SplitButtonModule,
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

  profile: any = {
    email: '',
    phoneNumber: '',
    profileIdentifier: '',
    firstName: '',
    lastName: ''
  };

  errorMessage: string = '';

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

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Simplified profile fetching
    if (this.authService.checkAuthState()) {
      this.fetchProfile();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isOwner(): boolean {
    return this.authService.hasRole('OWNER');
  }

  private fetchProfile(): void {
    this.userService.getProfile().pipe(
      takeUntil(this.destroy$),
      catchError((error: HttpErrorResponse) => {
        console.error('Profile fetch error:', error);
        this.errorMessage = 'Unable to fetch profile. Please try again.';
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return EMPTY;
      })
    ).subscribe(profileData => {
      console.log('Profile data received:', profileData);
      this.profile = {
        ...this.profile,
        ...profileData
      };
    });
  }

  onEditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  onEditPassword() {
    this.router.navigate(['/edit-password']);
  }

  onCreateCollection() {
    this.router.navigate(['/create-collection']);
  }

  onCreateAuction() {
    this.router.navigate(['/create-auction']);
  }
}