import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { Observable, take } from 'rxjs';
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

@Component({
  selector: 'app-profile-tabs',
  standalone: true,
  imports: [CommonModule, TabsModule, CollectionsTabComponent, PaginatorModule, AuctionCardComponent],
  templateUrl: './profile-tabs.component.html',
  styleUrls: ['./profile-tabs.component.css']
})

export class ProfileTabsComponent implements OnInit {
  user$: Observable<any>;
  userEmail: string = '';
  collections: any[] = []; 
  products: ProductVM[] = [];
  auctions: AuctionVm[] = [];
  likedAuctions: AuctionVm[] = [];
  victories: AuctionVm[] = [];

  totalRecords: number = 0; 
  first: number = 0;       
  rows: number = 12;
  @Input() userData: any; 

  activeTab: string = 'auctions';

  constructor(
    private store: Store, 
    private collectionService: CollectionsService, 
    private productService: ProductsService,
    private auctionService: AuctionsService,
    private imagesService: ImagesService,
    private authService: AuthService
  ) {
    this.user$ = this.store.select(selectUser);
  }

  // Instead of a static items array, we use a getter that returns the appropriate tabs.
  get itemsToShow(): string[] {
    // For bidder role, show only 'liked' and 'victories' (use lowercase to match your ngSwitch cases)
    return this.isBidder() ? ['liked', 'victories'] : ['auctions', 'collections', 'liked', 'victories'];
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.userEmail = user.email;

        if (this.isBidder()) {
          this.activeTab = this.itemsToShow[0]; // First bidder tab (liked)
        }
        
        this.selectTab(this.activeTab);
      }
    });
  }

    isOwner(): boolean {
      return this.authService.hasRole('OWNER');
    }

    isBidder(): boolean {
      return this.authService.hasRole('BIDDER');
    }

  onLikeToggled(updatedAuction: AuctionVm) {
    const index = this.auctions.findIndex(a => a.id === updatedAuction.id);
    if (index !== -1) {
      this.auctions[index] = { ...updatedAuction };
      this.auctions = [...this.auctions];
    }
  }

  private fetchUserVictories(page: number, size: number): void {
    // if (!this.userEmail) return;
  
    // this.auctionService.getUserWonAuctionsByEmail(this.userEmail, page, size)
    //   .pipe(take(1))
    //   .subscribe({
    //     next: (response) => {
    //       this.victories = response.data.content;
    //       this.totalRecords = response.data.page.totalElements;
    //     },
    //     error: (err) => console.error('Error fetching victories:', err),
    //   });
  }

  private fetchUserLikedAuctions(page: number, size: number): void {
    if (!this.userEmail) return;
  
    this.auctionService.getUserLikedAuctionsByEmail(this.userEmail, page, size)
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
    if (!this.isOwner() || !this.userEmail) return;
    
    this.auctionService.getUserAuctionsByEmail(this.userEmail, page, size)
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
    if (!this.isOwner() || !this.userEmail) return;
    this.collectionService.getCollectionsByEmail(this.userEmail, page, size).subscribe({
      next: (response) => {
        this.collections = response.data.content;
        this.totalRecords = response.data.page.totalElements;
        this.rows = response.data.page.size;
      },
      error: (err) => {
        console.error('Error fetching collections:', err);
      },
    });
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
      case 'liked':
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
        if (this.isOwner()) this.fetchOwnerCollections(page, this.rows);
        break;
      case 'auctions':
        if (this.isOwner()) this.fetchOwnerAuctions(page, this.rows);
        break;
      case 'liked':
        this.fetchUserLikedAuctions(page, this.rows);
        break;
      case 'victories':
        this.fetchUserVictories(page, this.rows);
        break;
    }
  }
  
  getImageUrl(imageUrl?: string): string {
    return imageUrl?.trim() ? this.imagesService.getImageUrl(imageUrl) : 'https://picsum.photos/400/300?random=1';
  }
}
