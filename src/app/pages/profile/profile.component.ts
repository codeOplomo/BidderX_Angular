import { Component, OnDestroy, OnInit } from '@angular/core';
import { RatingModule } from 'primeng/rating';
import { TabPanel, TabViewModule } from 'primeng/tabview';
import { TabsModule } from 'primeng/tabs';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ProfileTabsComponent } from '../../components/profile-tabs/profile-tabs.component';
import { ProfileVM } from '../../models/view-models/profile';

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
    ProfileTabsComponent,
    TabsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  // providers: [UserService, TabsModule, ProfileHeaderComponent, ProfileTabsComponent, TabViewModule]
})

export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  profile$: Observable<ProfileVM>;
  visitedProfile$!: Observable<ProfileVM>;
  isCurrentUser: boolean = false;
  userEmail: string = '';

  rating: number = 5;
  imageLoading = false;

  errorMessage: string = '';
  userId: string = '';

  
  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.profile$ = this.store.select(selectUser).pipe(
      filter((profile): profile is ProfileVM => profile !== null)
    );
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const email = params.get('email');
      if (email) {
        this.userEmail = email;
        this.visitedProfile$ = this.userService.getProfileByEmail(email).pipe(
          map(response => response.data)
        );
      } else {
        // Load current user if no email parameter
        this.store.dispatch(UserActions.loadUserProfile());
      }
    });
    
    this.profile$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(profile => {
      this.userId = profile.id ?? '';
      console.log('Wallet balance:', profile.wallet?.balance);
    });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
