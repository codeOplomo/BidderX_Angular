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

  totalRecords: number = 0; 
  first: number = 0;       
  rows: number = 12;
  @Input() userData: any; 
  items = ['Auctions', 'Collections', 'Products', 'Liked'];
  

  activeTab: string = 'auctions';

  constructor(
    private store: Store, 
    private collectionService: CollectionsService, 
    private productService: ProductsService,
    private auctionService: AuctionsService,
    private imagesService: ImagesService
  ) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      console.log('User data in ProfileComponent:', user);
      if (user) {
        this.userEmail = user.email;
        this.fetchUserCollections(0, this.rows);
        this.fetchUserProducts(0, this.rows);
        this.fetchUserAuctions(0, this.rows);
      }
    });
  }

  onLikeToggled(updatedAuction: AuctionVm) {
    // Update the parent's auction array with the updatedAuction
    const index = this.auctions.findIndex(a => a.id === updatedAuction.id);
    if (index !== -1) {
      this.auctions[index] = { ...updatedAuction };
      // Trigger change detection if necessary (e.g., using OnPush)
      this.auctions = [...this.auctions];
    }
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
  
  
  private fetchUserAuctions(page: number, size: number): void {
    if (!this.userEmail) return;
    
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

  
  fetchUserCollections(page: number, size: number): void {
    this.collectionService.getCollectionsByEmail(this.userEmail, page, size).subscribe({
      next: (response) => {
        this.collections = response.data.content;
        // Update these lines to extract pagination info from the page object:
        this.totalRecords = response.data.page.totalElements;
        this.rows = response.data.page.size;
      },
      error: (err) => {
        console.error('Error fetching collections:', err);
      },
    });
  }
  
  private fetchUserProducts(page: number, size: number): void {
      if (!this.userEmail) return;
      this.productService.getAvailableUserProductsByEmail(this.userEmail, page, size)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.products = response.data.content;
            console.log('User products:', this.products);
            
          },
          error: (err) => console.error('Error fetching products:', err),
        });
    }
  
  

    onPageChange(event: any): void {
      this.first = event.first;
      this.rows = event.rows;
      const page = event.page;
      
      // Fetch data based on active tab
      switch (this.activeTab) {
        case 'collections':
          this.fetchUserCollections(page, this.rows);
          break;
        case 'products':
          this.fetchUserProducts(page, this.rows);
          break;
        case 'auctions':
          this.fetchUserAuctions(page, this.rows);
          break;
      }
    }

  
    selectTab(tab: string) {
      this.activeTab = tab;
      // Reset pagination when switching tabs
      this.first = 0;
      const page = 0;
      
      switch (tab) {
        case 'collections':
          this.fetchUserCollections(page, this.rows);
          break;
        case 'products':
          this.fetchUserProducts(page, this.rows);
          break;
        case 'auctions':
          this.fetchUserAuctions(page, this.rows);
          break;
        case 'liked':
          this.fetchUserLikedAuctions(page, this.rows);
          break;
      }
    }
    

    
    getImageUrl(imageUrl?: string): string {
      return imageUrl?.trim() ? this.imagesService.getImageUrl(imageUrl) : 'https://picsum.photos/400/300?random=1';
    }
}