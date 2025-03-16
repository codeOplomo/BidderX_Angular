import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ImagesService } from '../../services/images.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collection-card',
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule],
  templateUrl: './collection-card.component.html',
  styleUrl: './collection-card.component.css'
})
export class CollectionCardComponent {
  @Input() collection: any;
  @Output() viewCollectionEvent = new EventEmitter<string>();
  displayItems: any[] = [];
  
  // Helper methods
  trackByItem(index: number, item: any): string {
    return item?.id || index;
  }


  constructor(private router: Router, private imagesService: ImagesService) {}

  ngOnInit() {
    this.prepareDisplayItems();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['collection']) {
      this.prepareDisplayItems();
    }
  }

  prepareDisplayItems() {
    // Create an array of exactly 3 items, using placeholders if needed
    this.displayItems = [];
    
    // Add actual items if they exist
    if (this.collection?.items && this.collection.items.length > 0) {
      for (let i = 0; i < Math.min(3, this.collection.items.length); i++) {
        this.displayItems.push(this.collection.items[i]);
      }
    }
    
    // Add placeholder items to ensure we have exactly 3
    while (this.displayItems.length < 3) {
      this.displayItems.push({ id: `placeholder-${this.displayItems.length}` });
    }
  }

  viewCollection(id?: string) {
    if (id) {
      this.router.navigate(['/collection-showcase', id]);
    } else {
      console.warn('Attempted to view collection with undefined id');
    }
  }


  getImageUrl(imageUrl?: string): string {
    return imageUrl?.trim() ? this.imagesService.getImageUrl(imageUrl) : 'https://picsum.photos/400/300?random=1';
  }

  onViewCollection(): void {
    if (this.collection?.id) {
      this.viewCollectionEvent.emit(this.collection.id);
    } else {
      console.warn('Attempted to view collection with undefined id');
    }
  }
  
}
