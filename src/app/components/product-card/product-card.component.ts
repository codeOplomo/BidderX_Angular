import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProductVM } from '../../models/view-models/product-vm';
import { CollectionItem } from '../../store/collections/collection.model';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: CollectionItem;
  @Input() editable: boolean = false; 

  constructor(private imagesService: ImagesService) {}

  getImageUrl(imagePath: string): string {
    return this.imagesService.getImageUrl(imagePath);
  }
}
