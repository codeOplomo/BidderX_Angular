import { Component } from '@angular/core';
import { CollectionsService } from '../../services/collections.service';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-collection-showcase',
  standalone: true,
  imports: [CardModule, ButtonModule, ReactiveFormsModule, CommonModule, ShowcaseHeaderComponent],
  templateUrl: './collection-showcase.component.html',
  styleUrl: './collection-showcase.component.css'
})
export class CollectionShowcaseComponent {

  collection$: Observable<Collection | null>;
  loading$: Observable<boolean>;
  error$: Observable<any>;


  constructor(
    private route: ActivatedRoute,
    private store: Store<{ collection: Collection}>,
  ) {
    this.collection$ = this.store.pipe(select(selectCollectionCoverImage));
    this.loading$ = this.store.pipe(select(selectCollectionLoading));
    this.error$ = this.store.pipe(select(selectCollectionError));
  }

  ngOnInit(): void {
    const collectionId = this.route.snapshot.paramMap.get('id');
    console.log('Collection ID:', collectionId); // Check if the correct ID is being passed
    if (collectionId) {
      this.store.dispatch(CollectionActions.loadCollection({ id: collectionId }));
    }
  }
  
  
  ngOnChanges() {
    console.log(this.collection$);  // Check if this collection is populated
  }
  

  onEditItem(item: any): void {
    console.log('Edit item:', item);
    // Navigate to an edit page or open a dialog
  }

  onDeleteItem(item: any): void {
    console.log('Delete item:', item);
    // Implement delete functionality
  }

}
