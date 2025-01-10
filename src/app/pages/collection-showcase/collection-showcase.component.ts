import { Component } from '@angular/core';
import { CollectionsService } from '../../services/collections.service';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowcaseHeaderComponent } from '../../components/showcase-header/showcase-header.component';

@Component({
  selector: 'app-collection-showcase',
  standalone: true,
  imports: [CardModule, ButtonModule, ReactiveFormsModule, CommonModule, ShowcaseHeaderComponent],
  templateUrl: './collection-showcase.component.html',
  styleUrl: './collection-showcase.component.css'
})
export class CollectionShowcaseComponent {

  collection: any = { items: [] }; // Initialize `items` as an empty array


  constructor(
    private route: ActivatedRoute,
    private collectionsService: CollectionsService
  ) {}

  ngOnInit(): void {
    const collectionId = this.route.snapshot.paramMap.get('id');
    this.fetchCollectionDetails(collectionId);
  }

  fetchCollectionDetails(id: string | null): void {
    if (id) {
      this.collectionsService.getCollectionById(id).subscribe(
        (response) => {
          console.log('Collection fetched:', response);
          this.collection = response.data;
        },
        (error) => {
          console.error('Error fetching collection:', error);
        }
      );
    }
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
