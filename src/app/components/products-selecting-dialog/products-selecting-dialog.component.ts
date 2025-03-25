import { Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { ProductVM } from '../../models/view-models/product-vm';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsService } from '../../services/products.service';
import { CollectionsService } from '../../services/collections.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { Store } from '@ngrx/store';
import { selectCurrentUserEmail } from '../../store/user/user.selectors';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { ImagesService } from '../../services/images.service';


@Component({
  selector: 'app-products-selecting-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, ProgressSpinnerModule, CarouselModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule],
  templateUrl: './products-selecting-dialog.component.html',
  styleUrl: './products-selecting-dialog.component.css'
})
export class ProductsSelectingDialogComponent {
  @Input() collectionId: string | null = null;
  @Output() closeDialog = new EventEmitter<boolean>();

  selectedProducts = new Set<string>();
  products: ProductVM[] = [];
  filteredProducts: ProductVM[] = [];
  loading = true;
  display = true;

  currentPage = 0;
  itemsPerPage = 3;

  math = Math;
  

  constructor(
    private productService: ProductsService,
    private collectionService: CollectionsService,
    private imagesService: ImagesService,
    private store: Store,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.store.select(selectCurrentUserEmail).subscribe(userEmail => {
      if (userEmail) {
        this.productService.getAvailableUserProductsByEmail(userEmail)
          .subscribe(response => {
            this.products = response.data.content;
  
            // Fetch collection products to filter them out
            if (this.collectionId) {
              this.productService.getCollectionProducts(this.collectionId).subscribe(response => {
                const collectionProducts = response.data; 
                const collectionProductIds = new Set(collectionProducts.map(p => p.id));
                
                this.filteredProducts = this.products.filter(p => 
                  !collectionProductIds.has(p.id)
                );
                this.loading = false;
              });
            } else {
              this.filteredProducts = [...this.products];
              this.loading = false;
            }
          });
      } else {
        this.loading = false;
      }
    });
  }
  
  nextPage(): void {
    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    if (this.currentPage < totalPages - 1) {
      this.currentPage++;
    } else {
      this.currentPage = 0; // Loop back to first page
    }
  }

  prevPage(): void {
    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    if (this.currentPage > 0) {
      this.currentPage--;
    } else {
      this.currentPage = totalPages - 1; // Loop back to last page
    }
  }

  getCurrentPageItems(): ProductVM[] {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts.slice(start, end);
  }

  toggleSelection(product: ProductVM): void {
    if (product.id && this.selectedProducts.has(product.id)) {
      this.selectedProducts.delete(product.id);
    } else if (product.id) {
      this.selectedProducts.add(product.id);
    }
  }

// 3. Update the handlePageChange method
handlePageChange(event: any): void {
  // Just let the carousel handle its own pagination
  console.log('Page changed:', event.page);
}

  isSelected(product: ProductVM) {
    return product.id ? this.selectedProducts.has(product.id) : false;
  }

  async addToCollection(): Promise<void> {
    if (!this.collectionId) {
      return;
    }
    try {
      await this.collectionService.addProductsToCollection(
        this.collectionId,
        Array.from(this.selectedProducts)
      ).toPromise();

      this.snackBar.open('Products added successfully!', 'Close', { duration: 3000 });
      this.close();
      this.closeDialog.emit(true);
    } catch (error) {
      this.snackBar.open('Error adding products', 'Close');
    }
  }

  getImageUrl(imagePath: string): string {
    return this.imagesService.getImageUrl(imagePath);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }
  
  // Add method to generate array for pagination
  getPaginationArray(): number[] {
    return Array.from({ length: this.getTotalPages() }, (_, i) => i);
  }

  close(): void {
    this.display = false;
    this.closeDialog.emit(false);
  }
}
