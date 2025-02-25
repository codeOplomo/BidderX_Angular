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
    this.thumbnails = [this.product!.imageUrl, ...(this.product!.featuredImages || [])];
  }

  get selectedImage(): string {
    return this.thumbnails[this.selectedThumb];
  }

  selectThumbnail(index: number): void {
    this.selectedThumb = index;
  }
}
