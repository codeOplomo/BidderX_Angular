import { Component, Input, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Collection } from '../../store/collections/collection.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CollectionsService } from '../../services/collections.service';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-collections-tab',
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule],
  templateUrl: './collections-tab.component.html',
  styleUrl: './collections-tab.component.css'
})
export class CollectionsTabComponent implements OnInit {
  @Input() collections: any[] = [];
  defaultAvatar = 'assets/placeholder-profile.jpg';

  constructor(private router: Router, private imagesService: ImagesService) {}

  ngOnInit() {}

  viewCollection(id?: string) {
    if (id) {
      this.router.navigate(['/collection-showcase', id]);
    } else {
      console.warn('Attempted to view collection with undefined id');
    }
  }

  generatePlaceholders(itemsCount: number): number[] {
    const placeholdersNeeded = Math.max(0, 3 - itemsCount);
    return Array(placeholdersNeeded).fill(0);
  }

  // Add these methods
  trackByCollection(index: number, collection: any): string {
    return collection?.id || index; // Use the collection ID, fallback to index if no ID
  }

  trackByItem(index: number, item: any): string {
    return item?.id || index; // Use the item ID, fallback to index if no ID
  }

  getImageUrl(imageUrl?: string): string {
    return imageUrl?.trim() ? this.imagesService.getImageUrl(imageUrl) : 'https://picsum.photos/400/300?random=1';
  }
  
}