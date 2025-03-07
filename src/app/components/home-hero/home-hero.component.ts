import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.css'
})
export class HomeHeroComponent {
  showEraDropdown = false;
  showCategoryDropdown = false;

  eras = ['Victorian', 'Art Deco', 'Mid-Century', 'Ancient'];
  categories = ['Furniture', 'Art', 'Jewelry', 'Memorabilia'];

  selectedEra: string | null = null;
  selectedCategory: string | null = null;

  toggleEraDropdown() {
    this.showEraDropdown = !this.showEraDropdown;
    this.showCategoryDropdown = false;
  }

  toggleCategoryDropdown() {
    this.showCategoryDropdown = !this.showCategoryDropdown;
    this.showEraDropdown = false;
  }

  selectEra(era: string) {
    this.selectedEra = era;
    this.showEraDropdown = false;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.showCategoryDropdown = false;
  }

  searchTreasures() {
    // Implement search logic here
    console.log('Searching with:', {
      era: this.selectedEra,
      category: this.selectedCategory
    });
  }
}
