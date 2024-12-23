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
import { Store } from '@ngrx/store';
import { UserState } from '../../store/user/user.state';
import { selectUser } from '../../store/user/user.selectors';

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

  
  user$!: Observable<any>;

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
    private store: Store<UserState>,
    private userService: UserService,
    private router: Router
  ) {  }

  ngOnInit() {
    // Initialize user$ after the store is available
    this.user$ = this.store.select(selectUser);
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
