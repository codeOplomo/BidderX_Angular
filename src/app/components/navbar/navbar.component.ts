import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../../services/auth.service';
import { Menu, MenuModule } from 'primeng/menu';
import { UserService } from '../../services/user.service';
import { BehaviorSubject, EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, delay, distinctUntilChanged, filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    MenuModule,
    ButtonModule,
    RippleModule,
    NgIf,
    NgClass,
    RouterModule,
    AvatarModule,
    BadgeModule
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('userMenu') userMenu!: Menu;

  private destroy$ = new Subject<void>();
  defaultAvatar = 'assets/default-avatar.png';

  // Declare user$ after the constructor
  user$: Observable<any>;

  items = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
    { label: 'About', icon: 'pi pi-info-circle', routerLink: '/about' },
    // Add more menu items here
  ];
  
  dropdownItems = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.goToProfile(),
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout(),
    },
  ];

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    // Initialize user$ in the constructor after authService is injected
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    // Make sure the user profile is loaded on component init, or rely on `user$` observable
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (!user) {
        this.loadUserProfile();
      }
    });
  }

  private loadUserProfile() {
    this.userService.getProfile().pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        console.error('Profile loading error:', error);
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return EMPTY;
      })
    ).subscribe(profile => {
      this.authService.setUser(profile); // Assuming a method to update user in auth service
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  toggleDropdown(event: Event) {
    this.userMenu.toggle(event);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
