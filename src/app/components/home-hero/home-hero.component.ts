import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '../../models/view-models/category.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.css'
})
export class HomeHeroComponent {
  backgroundImages: string[] = [
    'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=1772&q=80',
    'https://images.unsplash.com/photo-1581291519195-ef11498d1cfb?auto=format&fit=crop&w=1772&q=80',
    'https://images.unsplash.com/photo-1526040652367-ac003a0475fe?auto=format&fit=crop&w=1772&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1772&q=80',
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1772&q=80'
  ];
  currentImageIndex: number = 0;
  currentImage: string = this.backgroundImages[1];
  intervalId: any;

  searchTerm = ''; 
  showEraDropdown = false;
  showCategoryDropdown = false;

  eras = [
    { name: 'Ancient', start: null, end: 500 },
    { name: 'Medieval', start: 500, end: 1500 },
    { name: 'Renaissance', start: 1400, end: 1600 },
    { name: 'Baroque', start: 1600, end: 1750 },
    { name: 'Victorian', start: 1837, end: 1901 },
    { name: 'Modern', start: 1901, end: 1945 },
    { name: 'Mid-Century', start: 1945, end: 1965 },
    { name: 'Postmodern', start: 1965, end: 2000 },
    { name: 'Contemporary', start: 2000, end: null }
  ];
  
  selectedEra: { name: string, start: number | null, end: number | null } | null = null;

  categories: Category[] = [];
  selectedCategory: Category | null = null;

  constructor(private router: Router, private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.backgroundImages.length;
      this.currentImage = this.backgroundImages[this.currentImageIndex];
    }, 5000);
    this.categoriesService.getCategories().subscribe(
      response => {
        this.categories = response.data;
      },
      error => {
        console.error('Error fetching categories', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  toggleEraDropdown() {
    this.showEraDropdown = !this.showEraDropdown;
    this.showCategoryDropdown = false;
  }

  toggleCategoryDropdown() {
    this.showCategoryDropdown = !this.showCategoryDropdown;
    this.showEraDropdown = false;
  }

  selectEra(era: any) {
    this.selectedEra = era;
    this.showEraDropdown = false;
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
    this.showCategoryDropdown = false;
  }

  searchTreasures() {
  const queryParams: any = {};
  
  if (this.searchTerm) queryParams.q = this.searchTerm;
  if (this.selectedEra) {
    if (this.selectedEra.start) queryParams.startDate = this.selectedEra.start;
    if (this.selectedEra.end) queryParams.endDate = this.selectedEra.end;
  }
  if (this.selectedCategory) queryParams.categoryId = this.selectedCategory.id;

  this.router.navigate(['/explore-auctions'], { queryParams });
}
}
