import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProductVM } from '../../models/view-models/product-vm';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/view-models/category.model';
import { ApiResponse } from '../../models/view-models/api-response.model';


@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.css'
})
export class ProductInfoComponent implements OnChanges {
  @Input() product: ProductVM | null = null;
  category: string = '';

  constructor(private categoriesService: CategoriesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.loadCategory();
    }
  }

  loadCategory(): void {
    if (!this.product) return;

    this.categoriesService.getCategoryById(this.product.categoryId).subscribe({
      next: (response: ApiResponse<Category>) => {
        this.category = response.data.name;
      },
      error: () => {
        this.category = 'Unknown';
      }
    });
  }
}