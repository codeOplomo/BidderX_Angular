import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Category } from '../../models/view-models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { take } from 'rxjs';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

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
  categories: Category[] = [];


  constructor(
    private categoryService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getCategories()
      .pipe(take(1))
      .subscribe({
        next: (response) => this.categories = response.data,
        error: (err) => console.error('Failed to load categories', err),
      });
  }
}
