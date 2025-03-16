import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as CollectionActions from '../../store/collections/collection.actions';
import { ImagesService } from '../../services/images.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Collection } from '../../store/collections/collection.model';
import { CommonModule } from '@angular/common';
import { selectCollectionCoverImage } from '../../store/collections/collection.selectors';
import { Router } from '@angular/router';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { selectCurrentUserEmail } from '../../store/user/user.selectors';

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

  ownerEmail: string | null = null;
  isAuthenticated = false;

  currentUserEmail: string | null = null;
  coverImageLoading = false;
  private destroy$ = new Subject<void>();

  constructor(private imagesService: ImagesService, private router: Router, private store: Store<{ collection: Collection}>) {
    
    this.collection$ = this.store.pipe(select(selectCollectionCoverImage));
  }

  ngOnInit() {
    this.store.select(selectIsAuthenticated)
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => this.isAuthenticated = isAuth);

    this.store.select(selectCurrentUserEmail)
      .pipe(takeUntil(this.destroy$))
      .subscribe(email => this.currentUserEmail = email);

    this.collection$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(collection => {
      console.log('Header collection data:', collection);
      if (collection) {
        this.collectionId = collection.id ?? null;
        this.ownerEmail = collection.owner?.email || null;
      }
    });
  }
  
  get showUpdateIcon(): boolean {
    return this.isAuthenticated && this.currentUserEmail === this.ownerEmail;
  }

  navigateToProfile() {
    if (this.ownerEmail) {
      this.router.navigate(['/profile', this.ownerEmail]);
    } else {
      console.error('No owner email available');
    }
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
