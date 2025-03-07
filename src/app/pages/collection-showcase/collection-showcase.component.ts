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
import { selectCollectionCoverImage, selectCollectionError, selectCollectionLoading } from '../../store/collections/collection.selectors';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ImagesService } from '../../services/images.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-collection-showcase',
  standalone: true,
  imports: [CardModule, ButtonModule, ReactiveFormsModule, CommonModule, ShowcaseHeaderComponent, ProductCardComponent],
  templateUrl: './collection-showcase.component.html',
  styleUrl: './collection-showcase.component.css'
})
export class CollectionShowcaseComponent {

  collection$: Observable<Collection | null>;
  loading$: Observable<boolean>;
  error$: Observable<any>;


  constructor(
    private imagesService: ImagesService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private store: Store<{ collection: Collection}>,
    private router: Router
  ) {
    this.collection$ = this.store.pipe(select(selectCollectionCoverImage));
    this.loading$ = this.store.pipe(select(selectCollectionLoading));
    this.error$ = this.store.pipe(select(selectCollectionError));
  }

  ngOnInit(): void {
    const collectionId = this.route.snapshot.paramMap.get('id');
    if (collectionId) {
      this.store.dispatch(CollectionActions.loadCollection({ id: collectionId }));
    }
  }
  
  isOwner(): boolean {
    return this.authService.hasRole('OWNER');
  }

  retryLoading(): void {
    const collectionId = this.route.snapshot.paramMap.get('id');
    if (collectionId) {
      this.store.dispatch(CollectionActions.loadCollection({ id: collectionId }));
    }
  }

  openAddProductDialog(): void {
    const collectionId = this.route.snapshot.paramMap.get('id');
    if (collectionId) {
      // Navigate to create product page with collection ID as query param
      this.router.navigate(['/create-product'], { 
        queryParams: { collectionId: collectionId } 
      });
    } else {
      this.router.navigate(['/products/create']);
    }
  }
  
  ngOnChanges() {
    console.log(this.collection$);  
  }
  

  onEditItem(item: any): void {
    console.log('Edit item:', item);
    // Navigate to an edit page or open a dialog
  }

  onDeleteItem(item: any): void {
    console.log('Delete item:', item);
    // Implement delete functionality
  }

  getImageUrl(imagePath: string): string {
    return this.imagesService.getImageUrl(imagePath);
  }

  handleImageUpdate(newImageUrl: string): void {
  }
  

}
