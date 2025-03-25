import { Component } from '@angular/core';
import { CollectionsService } from '../../services/collections.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowcaseHeaderComponent } from '../../components/showcase-header/showcase-header.component';
import { Observable } from 'rxjs';
import { Collection } from '../../store/collections/collection.model';
import { select, Store } from '@ngrx/store';
import * as CollectionActions from '../../store/collections/collection.actions';
import { selectCollectionCoverImage, selectCollectionError, selectCollectionLoading, selectIsCurrentUserCollectionOwner } from '../../store/collections/collection.selectors';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ImagesService } from '../../services/images.service';
import { ProductChoiceDialogComponent } from '../../components/product-choice-dialog/product-choice-dialog.component';
import { ProductsSelectingDialogComponent } from '../../components/products-selecting-dialog/products-selecting-dialog.component';


@Component({
  selector: 'app-collection-showcase',
  standalone: true,
  imports: [CardModule, ButtonModule, ReactiveFormsModule, CommonModule, ShowcaseHeaderComponent, ProductCardComponent, ProductChoiceDialogComponent, ProductsSelectingDialogComponent],
  templateUrl: './collection-showcase.component.html',
  styleUrl: './collection-showcase.component.css'
})
export class CollectionShowcaseComponent {

  isCollectionOwner$: Observable<boolean>;
  collection$: Observable<Collection | null>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  displayProductChoiceDialog = false;
  displayProductsSelectingDialog = false;
  collectionId: string | null = null;

  constructor(
    private collectionService: CollectionsService,
    private imagesService: ImagesService,
    private route: ActivatedRoute,
    private store: Store<{ collection: Collection}>,
    private router: Router
  ) {
    this.collection$ = this.store.pipe(select(selectCollectionCoverImage));
    this.loading$ = this.store.pipe(select(selectCollectionLoading));
    this.error$ = this.store.pipe(select(selectCollectionError));
    this.isCollectionOwner$ = this.store.select(selectIsCurrentUserCollectionOwner);
  }

  ngOnInit(): void {
    this.collectionId = this.route.snapshot.paramMap.get('id');
    if (this.collectionId) {
      this.store.dispatch(CollectionActions.loadCollection({ id: this.collectionId as string }));
    }
  }
  

  openAddProductDialog(): void {
    this.displayProductChoiceDialog = true;
  }

  // Handle the choice made in the ProductChoiceDialogComponent
  onProductChoice(choice: 'new' | 'existing'): void {
    this.displayProductChoiceDialog = false;
    if (choice === 'new') {
      if (this.collectionId) {
        this.router.navigate(['/create-product'], { queryParams: { collectionId: this.collectionId } });
      } else {
        this.router.navigate(['/products/create']);
      }
    } else {
      // Open the existing products selection dialog
      this.displayProductsSelectingDialog = true;
    }
  }

  // After selecting products, refresh the collection if needed
  onProductsSelectionClosed(result: boolean): void {
    this.displayProductsSelectingDialog = false;
    if (result && this.collectionId) {
      this.store.dispatch(CollectionActions.loadCollection({ id: this.collectionId as string }));
    }
  }

  retryLoading(): void {
    if (this.collectionId) {
      this.store.dispatch(CollectionActions.loadCollection({ id: this.collectionId as string }));
    }
  }
  
  onDeleteItem(product: any): void {
    if (this.collectionId && product?.id) {
      // Call the collection service to remove the product
      this.collectionService.removeProductFromCollection(this.collectionId, product.id)
        .subscribe(
          () => {
            // Optionally refresh the collection or update local state
            this.store.dispatch(CollectionActions.loadCollection({ id: this.collectionId as string }));
            console.log('Product removed successfully');
          },
          error => {
            console.error('Error removing product', error);
          }
        );
    }
  }
  

  ngOnChanges() {
    console.log(this.collection$);  
  }
  

  onEditItem(item: any): void {
    console.log('Edit item:', item);
    // Navigate to an edit page or open a dialog
  }


  getImageUrl(imagePath: string): string {
    return this.imagesService.getImageUrl(imagePath);
  }

  handleImageUpdate(newImageUrl: string): void {
  }
  

}
