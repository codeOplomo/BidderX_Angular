import { Component, OnDestroy, OnInit } from '@angular/core';
import { RatingModule } from 'primeng/rating';
import { TabsModule } from 'primeng/tabs';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { SplitButton, SplitButtonModule } from 'primeng/splitbutton';
import { CommonModule, NgIf } from '@angular/common';
import { combineLatest, EMPTY, filter, Observable, Subject, take, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import * as UserActions from '../../store/user/user.actions';
import { selectUser } from '../../store/user/user.selectors';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RatingModule,
    CommonModule,
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
  user$: Observable<any>;

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
  }

  updateProfile(profileData: any) {
    this.store.dispatch(UserActions.updateUserProfile({ profileData }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isOwner(): boolean {
    return this.authService.hasRole('OWNER');
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