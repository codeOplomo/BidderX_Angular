import { Component } from '@angular/core';
import { AuctionVm } from '../../models/view-models/auction-vm.model';
import { ActivatedRoute } from '@angular/router';
import { AuctionsService } from '../../services/auctions.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/view-models/category.model';
import { AuctionCardComponent } from "../../components/auction-card/auction-card.component";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-auctions-explorer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AuctionCardComponent, MatPaginator],
  templateUrl: './auctions-explorer.component.html',
  styleUrl: './auctions-explorer.component.css',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden',
        padding: '0',
        marginBottom: '0',
        borderWidth: '0'
      })),
      state('expanded', style({
        height: '*',
        opacity: 1,
        padding: '2rem',
        marginBottom: '3rem',
        borderWidth: '1px'
      })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out'))
    ])
  ]
})
export class AuctionsExplorerComponent {
  filtersVisible = false;
  auctions: AuctionVm[] = [];
  filteredAuctions: AuctionVm[] = [];
  auctionsStatus: { label: string; value: string }[] = [
    // { label: 'All Listings', value: '' },
    { label: 'Active Now', value: 'APPROVED' },
    { label: 'Recently Ended', value: 'ENDED' }
  ];
  auctionsType: { label: string; value: string }[] = [
    { label: 'All Types', value: '' },
    { label: 'Timed Auctions', value: 'TIMED' },
    { label: 'Instant Auctions', value: 'INSTANT' }
  ];

  categories: Category[] = [];
  selectedCategory: string | null = null;

  eraStart: number | null = null;
  eraEnd: number | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedStatus: string = 'APPROVED';
  selectedSortOrder: 'ASC' | 'DESC' = 'DESC';
  searchQuery: string = '';
  selectedType: string | null = null;

  currentPage: number = 0;
  pageSize: number = 8;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private auctionsService: AuctionsService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.route.queryParamMap.subscribe(params => {
      this.selectedCategory = params.get('categoryId');
      this.searchQuery = params.get('q') || '';
      this.selectedType = params.get('type') || '';
      const startDateParam = params.get('startDate');
      const endDateParam = params.get('endDate');
      this.eraStart = startDateParam ? Number(startDateParam) : null;
      this.eraEnd = endDateParam ? Number(endDateParam) : null;
      
      this.getAuctions();
    });
  }


  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  getAuctions(): void {
    this.auctionsService.getAuctionsByFilter(
      this.selectedCategory,
      this.minPrice,
      this.maxPrice,
      this.selectedStatus,
      this.selectedType,
      this.eraStart ?? undefined,
      this.eraEnd ?? undefined,
      this.selectedSortOrder,
      this.currentPage,
      this.pageSize,
      this.searchQuery
    ).subscribe({
      next: (response) => {
        this.auctions = response.data.content;
        this.filteredAuctions = this.auctions;
        this.totalPages = response.data.page.totalPages;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
      },
      error: (error) => {
        console.error('Error fetching auctions:', error);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAuctions();
  }
  
  applyFilters(): void {
    this.getAuctions();
  }

  onPriceFilterChange(): void {
    this.applyFilters();
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

}
