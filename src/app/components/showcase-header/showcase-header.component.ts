import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as CollectionActions from '../../store/collections/collection.actions';
import { ImagesService } from '../../services/images.service';
import { CollectionsService } from '../../services/collections.service';
import { Observable } from 'rxjs';
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

  // @Input() collection: Collection | null = null;

  @Output() imageUpdated = new EventEmitter<string>();

  collection$: Observable<Collection | null>;

  constructor(private collectionsService: CollectionsService, private imagesService: ImagesService, private store: Store<{ collection: Collection}>) {
    
    this.collection$ = this.store.pipe(select(selectCollectionCoverImage));
  }

  ngOnInit() {
  }
  

  getImageUrl(imagePath: string): string {
    return this.imagesService.getImageUrl(imagePath);
  }

  onUpdateCoverPicture() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        this.collectionsService.uploadShowcaseCoverImage(file).subscribe({
          next: ({ imageUrl }) => {
            this.imageUpdated.emit(imageUrl);
            this.store.dispatch(CollectionActions.updateCollectionCoverImageSuccess({ imageUrl }));
          },
          error: (error) => {
            console.error('Showcase cover upload failed:', error);
            this.store.dispatch(CollectionActions.updateCollectionCoverImageFailure({ error }));
          }
        });
      }
    };

    fileInput.click();
  }
}
