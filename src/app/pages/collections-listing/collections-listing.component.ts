import { Component } from '@angular/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { CollectionsService } from '../../services/collections.service';
import { Collection } from '../../store/collections/collection.model';
import { CollectionCardComponent } from '../../components/collection-card/collection-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collections-listing',
  standalone: true,
  imports: [MatPaginatorModule, CollectionCardComponent, CommonModule],
  templateUrl: './collections-listing.component.html',
  styleUrl: './collections-listing.component.css'
})
export class CollectionsListingComponent {
  collections: Collection[] = [];
  totalCollections = 0;
  pageSize = 12;
  pageIndex = 0;
  loading = true;

  constructor(
    private collectionsService: CollectionsService
  ) { }

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    this.loading = true;
    this.collectionsService.getCollections(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.collections = response.data.content;
        this.totalCollections = response.data.page.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading collections:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCollections();
  }
}
