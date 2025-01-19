import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as CollectionActions from '../../store/collections/collection.actions';
import { ImagesService } from '../../services/images.service';
import { CollectionsService } from '../../services/collections.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Collection } from '../../store/collections/collection.model';
import { CommonModule } from '@angular/common';
import { selectCollectionCoverImage } from '../../store/collections/collection.selectors';

@Component({
  selector: 'app-showcase-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './showcase-header.component.html',
  styleUrl: './showcase-header.component.css'
})
export class ShowcaseHeaderComponent implements OnInit {

  @Output() imageUpdated = new EventEmitter<string>();

  collection$: Observable<Collection | null>;
  private collectionId: string | null = null; 
  coverImageLoading = false;
  private destroy$ = new Subject<void>();

  constructor(private collectionsService: CollectionsService, private imagesService: ImagesService, private store: Store<{ collection: Collection}>) {
    
    this.collection$ = this.store.pipe(select(selectCollectionCoverImage));
  }

  ngOnInit() {
    // Store the collection ID when the collection data is loaded
    this.collection$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(collection => {
      console.log('Header collection data:', collection);
      if (collection) {
        this.collectionId = collection.id ?? null;
      }
    });
  }
  

  getImageUrl(imagePath: string): string {
    return this.imagesService.getImageUrl(imagePath);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onUpdateCoverPicture() {
    if (!this.collectionId) {
      console.error('No collection ID available');
      return;
    }

    this.store.dispatch(CollectionActions.updateCollectionCoverImage({ 
      collectionId: this.collectionId 
    }));
  }
}
