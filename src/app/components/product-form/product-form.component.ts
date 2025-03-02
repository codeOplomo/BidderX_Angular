import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Category } from '../../models/view-models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { Observable, take } from 'rxjs';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CollectionsService } from '../../services/collections.service';
import { selectUser } from '../../store/user/user.selectors';
import { Collection } from '../../store/collections/collection.model';
import { PaginatedApiResponse } from '../../models/view-models/paginated-api-response.model';
import { ApiResponse } from '../../models/view-models/api-response.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class ProductFormComponent {
  @Input() parentForm!: FormGroup;
  user$: Observable<any>;
    userEmail: string = '';
    collections: Collection[] = []; 
  categories: Category[] = [];

  currentPage: number = 0;
  pageSize: number = 12;
  totalElements: number = 0;


  constructor(
    private store: Store,
    private collectionService: CollectionsService,
    private categoryService: CategoriesService
  ) { 
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.loadCategories();
    this.user$.subscribe(user =>{ 
      console.log('User data in ProfileComponent:', user);
      if (user) {
        this.userEmail = user.email; 
        this.fetchUserCollections(); 
      }
      });
  }

  private loadCategories(): void {
    this.categoryService.getCategories()
      .pipe(take(1))
      .subscribe({
        next: (response) => this.categories = response.data,
        error: (err) => console.error('Failed to load categories', err),
      });
  }

  fetchUserCollections() {
    this.collectionService.getCollectionsByEmail(
      this.userEmail,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response: ApiResponse<PaginatedApiResponse<Collection>>) => {
        this.collections = response.data.content;
        this.totalElements = response.data.page.totalElements;
        console.log('Fetched collections:', this.collections);
      },
      error: (err) => {
        console.error('Error fetching collections by user ID:', err);
      },
    });
  }
}
