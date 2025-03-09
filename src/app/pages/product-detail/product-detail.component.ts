import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ProductGalleryComponent } from '../../components/product-gallery/product-gallery.component';
import { ProductInfoComponent } from "../../components/product-info/product-info.component";
import { ProductTabsComponent } from "../../components/product-tabs/product-tabs.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ProductVM } from '../../models/view-models/product-vm';
import { ProductsService } from '../../services/products.service';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { ImagesService } from '../../services/images.service';
import { PlaceBidCardComponent } from "../../components/place-bid-card/place-bid-card.component";
import { AuctionVm } from '../../models/view-models/auction-vm.model';
import { AuctionsService } from '../../services/auctions.service';
import { Store } from '@ngrx/store';
import { selectWalletBalance } from '../../store/wallet/wallet.selectors';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [ProductGalleryComponent, ReactiveFormsModule, CommonModule, TabViewModule, DividerModule, TagModule, BadgeModule, MenuModule, AvatarModule, CardModule, ImageModule, ButtonModule, ProductInfoComponent, ProductTabsComponent, PlaceBidCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product: ProductVM | null = null;
  auction: AuctionVm | null = null;
  walletBalance$!: Observable<number>;
  walletLoading = false;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private imagesService: ImagesService,
    private auctionsService: AuctionsService,
    private store: Store,
    private router: Router,
    ) {
      this.walletBalance$ = this.store.select(selectWalletBalance);
    }

    ngOnInit(): void {
      this.route.params.pipe(
        switchMap(params => {
          const productId = params['id'];
          return this.productService.getProductById(productId);
        }),
        tap(response => {
          if (response?.data) {
            this.product = response.data;
          } else {
            this.error = 'Product not found';
          }
          this.loading = false;
        }),
        switchMap(() => {
          // Only fetch auction if auctionId exists on the product
          if (this.product?.auctionId) {
            return this.auctionsService.getAuctionById(this.product.auctionId);
          }
          return of(null);
        })
      ).subscribe(auctionResponse => {
        if (auctionResponse?.data) {
          this.auction = auctionResponse.data;
        }
      }, error => {
        console.error('Error fetching auction:', error);
      });
    }


     getAuctionTypeDisplay(type: string | undefined): string {
      if (!type) return 'Standard Auction';
      switch (type.toUpperCase()) {
        case 'TIMED':
          return 'Timed Auction';
        case 'INSTANT':
          return 'Buy It Now';
        default:
          return type;
      }
    }
  
    getImageUrl(imagePath: string): string {
      return this.imagesService.getImageUrl(imagePath);
    }

}
