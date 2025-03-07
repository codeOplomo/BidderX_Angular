import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ProductVM } from '../../models/view-models/product-vm';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.css'
})
export class ProductGalleryComponent {
  @Input() product: ProductVM | null = null;
  selectedThumb = 0;
  thumbnails: string[] = [];

  // In your component class
showLightbox = false;

openLightbox(): void {
  this.showLightbox = true;
}

closeLightbox(): void {
  this.showLightbox = false;
}
  constructor(private imagesService: ImagesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.loadThumbnails();
    }
  }

  getImageUrl(imagePath: string): string {
    return this.imagesService.getImageUrl(imagePath);
  }

  loadThumbnails(): void {
    if (this.product) {
      // Create a base array, only adding imageUrl if it exists
      const images: string[] = [];
      
      if (this.product.imageUrl) {
        images.push(this.product.imageUrl);
      }
      
      // Only spread featuredImages if it exists
      if (this.product.featuredImages && this.product.featuredImages.length > 0) {
        images.push(...this.product.featuredImages);
      }
      
      this.thumbnails = images;
    }
  }

  get selectedImage(): string {
    return this.thumbnails[this.selectedThumb];
  }

  selectThumbnail(index: number): void {
    this.selectedThumb = index;
  }
}
