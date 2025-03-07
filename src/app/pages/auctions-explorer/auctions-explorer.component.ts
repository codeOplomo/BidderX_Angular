import { Component } from '@angular/core';
import { AuctionVm } from '../../models/view-models/auction-vm.model';
import { ActivatedRoute } from '@angular/router';
import { AuctionsService } from '../../services/auctions.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auctions-explorer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './auctions-explorer.component.html',
  styleUrl: './auctions-explorer.component.css'
})
export class AuctionsExplorerComponent {
  auctions: AuctionVm[] = [];
  filteredAuctions: AuctionVm[] = [];
  selectedCategory: string | null = null;
  // Optional additional filters
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private auctionsService: AuctionsService
  ) {}

  ngOnInit(): void {
    // Retrieve the 'category' query parameter (if available)
    this.route.queryParamMap.subscribe(params => {
      this.selectedCategory = params.get('categoryId');
      // Fetch auctions once we have the filter parameter
      this.getAuctions();
    });
  }

  getAuctions(): void {
    this.auctionsService.getAuctionsByFilter(
      this.selectedCategory,
      this.minPrice,
      this.maxPrice
    ).subscribe({
      next: (response) => {
        this.auctions = response.data.content;
        this.filteredAuctions = this.auctions;
      },
      error: (error) => {
        console.error('Error fetching auctions:', error);
      }
    });
  }

  applyFilters(): void {
    this.getAuctions();
  }

  // Called when the user changes the price filter inputs
  onPriceFilterChange(): void {
    this.applyFilters();
  }
}
