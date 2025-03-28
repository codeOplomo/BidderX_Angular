import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProductVM } from '../../models/view-models/product-vm';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/view-models/category.model';
import { ApiResponse } from '../../models/view-models/api-response.model';
import { AuctionVm } from '../../models/view-models/auction-vm.model';
import { CommonModule } from '@angular/common';
import { AuctionRectionsService } from '../../services/auction-rections.service';
import { Store } from '@ngrx/store';
import { selectWalletBalance } from '../../store/wallet/wallet.selectors';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';


@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.css'
})
export class ProductInfoComponent implements OnChanges {
  isAuthenticated = false;
  @Input() product: ProductVM | null = null;
  @Input() auction: AuctionVm | null = null;
  category: string = '';
  likes: number = 0;
  isLiked: boolean = false;

  constructor(
    private categoriesService: CategoriesService,
    private auctionReactionsService: AuctionRectionsService,
    private router: Router,
    private store: Store
  ) {
    this.store.select(selectIsAuthenticated)
      .subscribe(isAuth => this.isAuthenticated = isAuth);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.loadCategory();
    }
    if (changes['auction']) {
      this.likes = this.auction?.reactionsCount || 0;
      this.isLiked = this.auction?.likedByCurrentUser || false;
    }
  }

  toggleLike(): void {
    if (!this.isAuthenticated || !this.auction) return; 

    const previousLikes = this.likes;
    const previousIsLiked = this.isLiked;

    this.isLiked = !this.isLiked;
    this.likes += this.isLiked ? 1 : -1;

    this.auctionReactionsService.toggleLike(this.auction.id).subscribe({
      error: (error) => {
        console.error('Error toggling like:', error);
        this.likes = previousLikes;
        this.isLiked = previousIsLiked;
      }
    });
  }
  
  loadCategory(): void {
    if (!this.product || !this.product.category) return;
  
    this.categoriesService.getCategoryById(this.product.category.id).subscribe({
      next: (response: ApiResponse<Category>) => {
        this.category = response.data.name;
      },
      error: () => {
        this.category = 'Unknown';
      }
    });
  }

  navigateToAuctionsExplorer() {
    if (this.product?.category?.id) {
      this.router.navigate(['/explore-auctions'], {
        queryParams: { categoryId: this.product.category.id }
      });
    }
  }
}