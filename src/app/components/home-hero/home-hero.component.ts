import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.css'
})
export class HomeHeroComponent {
  searchTerm = ''; 
  showEraDropdown = false;
  showCategoryDropdown = false;

  eras = ['Victorian', 'Art Deco', 'Mid-Century', 'Ancient'];
  categories = ['Furniture', 'Art', 'Jewelry', 'Memorabilia'];

  selectedEra: string | null = null;
  selectedCategory: string | null = null;

  constructor(private router: Router) {}

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
    if (this.searchTerm) {
      this.router.navigate(['/explore-auctions'], {
        queryParams: { q: this.searchTerm }
      });
    }
  }
}
