import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { Observable, Subscription, take } from 'rxjs';
import { CollectionsTabComponent } from '../collections-tab/collections-tab.component';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/user/user.selectors';
import { CollectionsService } from '../../services/collections.service';
import { PaginatorModule } from 'primeng/paginator';
import { ProductsService } from '../../services/products.service';
import { AuctionVm } from '../../models/view-models/auction-vm.model';
import { AuctionsService } from '../../services/auctions.service';
import { AuctionCardComponent } from '../auction-card/auction-card.component';
import { ImagesService } from '../../services/images.service';
import { ProductVM } from '../../models/view-models/product-vm';
import { AuthService } from '../../services/auth.service';
import { CollectionCardComponent } from '../collection-card/collection-card.component';
import { ProfileVM } from '../../models/view-models/profile';
import { selectIsBidder, selectIsOwner } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-profile-tabs',
  standalone: true,
  imports: [CommonModule, TabsModule, CollectionsTabComponent, PaginatorModule, AuctionCardComponent, CollectionCardComponent],
  templateUrl: './profile-tabs.component.html',
  styleUrls: ['./profile-tabs.component.css']
})

export class ProfileTabsComponent implements OnInit {
  userEmail: string = '';
  currentUserEmail: string = '';

  collections: any[] = [];
  products: ProductVM[] = [];
  auctions: AuctionVm[] = [];
  likedAuctions: AuctionVm[] = [];
  victories: AuctionVm[] = [];

  isOwner$: Observable<boolean>;
  isBidder$: Observable<boolean>;
  // Local copies of role flags for synchronous access in methods
  isOwner: boolean = false;
  isBidder: boolean = false;
  private subscriptions: Subscription = new Subscription();

  totalRecords: number = 0;
  first: number = 0;
  rows: number = 12;
  @Input() userData: ProfileVM | null = null;
  @Input() isCurrentUser: boolean = false;

  activeTab: string = 'auctions';

  constructor(
    private store: Store,
    private collectionService: CollectionsService,
    private auctionService: AuctionsService,
    private imagesService: ImagesService,
  ) {

    this.isOwner$ = this.store.select(selectIsOwner);
    this.isBidder$ = this.store.select(selectIsBidder);
  }

  private getProfileEmail(): string | undefined {
    return this.isCurrentUser ? this.currentUserEmail : this.userData?.email;
  }

  get itemsToShow(): string[] {
    if (this.isCurrentUser) {
      if (this.isOwner) {
        return ['auctions', 'collections', 'tracked', 'victories'];
      }
      if (this.isBidder) {
        return ['tracked', 'victories'];
      }
      return [];
    } else {
      if (this.userData?.roles.includes('BIDDER')) {
        return ['victories'];
      } else {
        return ['auctions', 'collections', 'victories'];
      }
    }
  }
  

  ngOnInit(): void {
    this.subscriptions.add(
      this.store.select(selectUser).subscribe(currentUser => {
        if (currentUser) {
          this.currentUserEmail = currentUser.email;
          // This check ensures that userData is compared against the logged-in email.
          this.isCurrentUser = this.userData?.email === this.currentUserEmail;
          this.updateActiveTab();
        }
      })
    );

    // Subscribe to role observables to set local booleans.
    this.subscriptions.add(
      this.isOwner$.subscribe(isOwner => {
        this.isOwner = isOwner;
        this.updateActiveTab();
      })
    );
    this.subscriptions.add(
      this.isBidder$.subscribe(isBidder => {
        this.isBidder = isBidder;
        this.updateActiveTab();
      })
    );
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && this.userData) {
      this.userEmail = this.userData.email;
      this.isCurrentUser = this.userData.email === this.currentUserEmail;
      this.updateActiveTab();
    }
  }

  onLikeToggled(updatedAuction: AuctionVm) {
    const index = this.auctions.findIndex(a => a.id === updatedAuction.id);
    if (index !== -1) {
      this.auctions[index] = { ...updatedAuction };
      this.auctions = [...this.auctions];
    }
  }

  private fetchUserVictories(page: number, size: number): void {
    const email = this.getProfileEmail();
    if (!email) return;
    this.auctionService.getUserWonAuctions(email, page, size)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.victories = response.data.content;
          this.totalRecords = response.data.page.totalElements;
        },
        error: (err) => console.error('Error fetching won auctions:', err),
      });
  }

  private fetchUserLikedAuctions(page: number, size: number): void {
    const email = this.getProfileEmail();
    if (!email) return;
    this.auctionService.getUserLikedAuctionsByEmail(email, page, size)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.likedAuctions = response.data.content;
          this.totalRecords = response.data.page.totalElements;
        },
        error: (err) => console.error('Error fetching liked auctions:', err),
      });
  }

  private fetchOwnerAuctions(page: number, size: number): void {
    const email = this.getProfileEmail();
    if (!email) return;
    console.log("email:" + email);
    // Determine if the profile being viewed is owned by an owner:
    const isProfileOwner = this.isCurrentUser 
      ? this.isOwner 
      : (this.userData?.roles.includes('OWNER') ?? false);
    if (!isProfileOwner) return;
    console.log("isProfileOwner:" + isProfileOwner);
    
    this.auctionService.getUserAuctionsByEmail(email, page, size)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.auctions = response.data.content;
          this.totalRecords = response.data.page.totalElements;
        },
        error: (err) => console.error('Error fetching auctions:', err),
      });
  }
  
  fetchOwnerCollections(page: number, size: number): void {
    const email = this.getProfileEmail();
    if (!email) return;
    const isProfileOwner = this.isCurrentUser 
      ? this.isOwner 
      : (this.userData?.roles.includes('OWNER') ?? false);
    if (!isProfileOwner) return;
    
    this.collectionService.getCollectionsByEmail(email, page, size)
      .subscribe({
        next: (response) => {
          this.collections = response.data.content;
          this.totalRecords = response.data.page.totalElements;
          this.rows = response.data.page.size;
        },
        error: (err) => console.error('Error fetching collections:', err),
      });
  }
  

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    const page = event.page;

    switch (this.activeTab) {
      case 'collections':
        this.fetchOwnerCollections(page, this.rows);
        break;
      case 'auctions':
        this.fetchOwnerAuctions(page, this.rows);
        break;
      case 'tracked':
        this.fetchUserLikedAuctions(page, this.rows);
        break;
      case 'victories':
        this.fetchUserVictories(page, this.rows);
        break;
    }
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.first = 0;
    const page = 0;

    switch (tab) {
      case 'collections':
        this.fetchOwnerCollections(page, this.rows);
        break;
      case 'auctions':
        this.fetchOwnerAuctions(page, this.rows);
        break;
      case 'tracked':
        this.fetchUserLikedAuctions(page, this.rows);
        break;
      case 'victories':
        this.fetchUserVictories(page, this.rows);
        break;
    }
  }

  private updateActiveTab(): void {
    const availableTabs = this.itemsToShow;
    // If the current active tab is not in the available tabs, set it to the first available one.
    if (!availableTabs.includes(this.activeTab)) {
      this.activeTab = availableTabs[0];
      this.selectTab(this.activeTab);
    }
  }
  

  getImageUrl(imageUrl?: string): string {
    return imageUrl?.trim() ? this.imagesService.getImageUrl(imageUrl) : 'https://picsum.photos/400/300?random=1';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }



  // private fetchOwnerProducts(page: number, size: number): void {
  //   if (!this.isOwner() || !this.userEmail) return;
  //     this.productService.getAvailableUserProductsByEmail(this.userEmail, page, size)
  //     .pipe(take(1))
  //     .subscribe({
  //       next: (response) => {
  //         this.products = response.data.content;
  //       },
  //       error: (err) => console.error('Error fetching products:', err),
  //     });
  // }
}
