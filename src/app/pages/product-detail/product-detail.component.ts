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
import { catchError, of, switchMap } from 'rxjs';
import { ImagesService } from '../../services/images.service';
import { PlaceBidCardComponent } from "../../components/place-bid-card/place-bid-card.component";


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [ProductGalleryComponent, ReactiveFormsModule, CommonModule, TabViewModule, DividerModule, TagModule, BadgeModule, MenuModule, AvatarModule, CardModule, ImageModule, ButtonModule, ProductInfoComponent, ProductTabsComponent, PlaceBidCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product: ProductVM | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private imagesService: ImagesService,
    private router: Router,
    ) {}

    ngOnInit(): void {
      this.route.params.pipe(
        switchMap(params => {
          const productId = params['id'];
          return this.productService.getProductById(productId).pipe(
            catchError(error => {
              this.error = 'Failed to load product';
              this.loading = false;
              return of(null);
            })
          );
        })
      ).subscribe(response => {
        if (response?.data) {
          this.product = response.data;
        } else {
          this.error = 'Product not found';
        }
        this.loading = false;
      });
    }


    shouldShowBidCard(): boolean {
      if (!this.product) return false;
      
      const now = new Date();
      const startTime = new Date();
      
      // Only show if auction has started
      return now >= startTime;
    }

    
    getImageUrl(imagePath: string): string {
      return this.imagesService.getImageUrl(imagePath);
    }

}
