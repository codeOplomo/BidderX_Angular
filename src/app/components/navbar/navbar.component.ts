import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../../services/auth.service';
import { Menu, MenuModule } from 'primeng/menu';
import { UserService } from '../../services/user.service';
import { BehaviorSubject, EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, delay, distinctUntilChanged, filter, finalize, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { Store } from '@ngrx/store';
import { UserState } from '../../store/user/user.state';
import { selectUser } from '../../store/user/user.selectors';
import { ImagesService } from '../../services/images.service';
import { FormsModule } from '@angular/forms';
import { AuctionVm } from '../../models/view-models/auction-vm.model';
import { AuctionsService } from '../../services/auctions.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    NgIf,
    RouterModule,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  isDropdownOpen = false;
  isUserMenuOpen = false;

  searchQuery: string = '';
  searchResults: AuctionVm[] = [];
  isSearchLoading = false;
  private searchSubject = new Subject<string>();

  private destroy$ = new Subject<void>();
  defaultAvatar = 'assets/default-avatar.png';


  user$!: Observable<any>;

  items = [
    { label: 'Home', icon: 'home', routerLink: '/' },
    { 
      label: 'Explore', 
      icon: 'explore', 
      routerLink: '/explore-auctions',
      subItems: [
        { label: 'Timed Auctions', routerLink: '/explore-auctions', queryParams: { type: 'TIMED' } },
        { label: 'Instant Auctions', routerLink: '/explore-auctions', queryParams: { type: 'INSTANT' } }
      ]
    },
    { label: 'About', icon: 'info', routerLink: '/about' }
  ];

  dropdownItems = [
    {
      label: 'Profile',
      icon: 'person',
      command: () => this.goToProfile(),
    },
    {
      label: 'Logout',
      icon: 'logout',
      command: () => this.logout(),
    },
  ];

  constructor(
    public authService: AuthService,
    private auctionsService: AuctionsService,
    private userService: UserService,
    private imagesService: ImagesService,
    private store: Store<UserState>,
    private router: Router
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.length > 2) {
          this.isSearchLoading = true;
          return this.auctionsService.searchAuctions(query, 5).pipe(
            finalize(() => this.isSearchLoading = false),
            catchError(() => of([]))
          );
        }
        return of([]);
      })
    ).subscribe(results => {
      this.searchResults = results;
    });
   }

   onSearchInput(): void {
    this.searchSubject.next(this.searchQuery.trim());
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
  }

  onSearch(): void {
    // Navigate to the search results page with the query as a parameter.
    this.router.navigate(['/explore-auctions'], { queryParams: { q: this.searchQuery } });
  }

  
  navigateToAuction(productId?: string): void {
    this.router.navigate(['/product-detail', productId]);
  }
  ngOnInit() {
    // Initialize user$ after the store is available
    this.user$ = this.store.select(selectUser);
  }

  getAvatarUrl(imagePath: string): string {
    return this.imagesService.getImageUrl(imagePath);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
  goToExplorer(routerLink: string, queryParams?: any): void {
    this.router.navigate([routerLink], { queryParams: queryParams || {} });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  handleSearchResultClick(productId?: string) {
    this.clearSearch();
    this.navigateToAuction(productId);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
