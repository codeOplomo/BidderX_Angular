import { Component } from '@angular/core';
import { HomeHeroComponent } from '../../components/home-hero/home-hero.component';
import { AuctionCardComponent } from '../../components/auction-card/auction-card.component';
import { CommonModule } from '@angular/common';
import { CollectionCardComponent } from "../../components/collection-card/collection-card.component";
import { Collection } from '../../store/collections/collection.model';
import { CollectionsService } from '../../services/collections.service';
import { ApiResponse } from '../../models/view-models/api-response.model';
import { PaginatedApiResponse } from '../../models/view-models/paginated-api-response.model';
import { AuctionVm } from '../../models/view-models/auction-vm.model';
import { AuctionsService } from '../../services/auctions.service';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Category } from '../../models/view-models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { Router } from '@angular/router';
import { RankingOwnersCardComponent } from "../../components/ranking-owners-card/ranking-owners-card.component";
import { OwnerRankingVM } from '../../models/view-models/owner-ranking-vm';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeHeroComponent, CommonModule, CollectionCardComponent, AuctionCardComponent, RankingOwnersCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('staggeredFade', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('expandCollapse', [
      transition(':enter', [
        style({ opacity: 0, height: 0, overflow: 'hidden' }),
        animate('300ms ease-out', style({ opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*', overflow: 'hidden' }),
        animate('300ms ease-out', style({ opacity: 0, height: 0 }))
      ])
    ])
  ]
})
export class HomeComponent {
  topOwners: OwnerRankingVM[] = [];
  collections: Collection[] = [];
  displayedCollections: Collection[] = [];
  liveAuctions: AuctionVm[] = [];
  categories: Category[] = [];
  categoryIcons: {[key: string]: string} = {
    'Paintings': 'brush',
    'Sculptures': 'architecture',
    'Photography': 'camera_alt',
    'Prints': 'print',
    'default': 'category'
  };

  showMore: boolean = false; 
  auctionsShowMore: boolean = false;

  durations = [
    { value: '1d', label: '1 day' },
    { value: '7d', label: '7 Day\'s' },
    { value: '15d', label: '15 Day\'s' },
    { value: '1m', label: '30 Day\'s' }
  ];
  selectedDuration = this.durations[0]; 
showDurationDropdown = false;

  chartData: any[] = [
    { month: 'Jan', value: 65, height: '65%' },
    { month: 'Feb', value: 59, height: '59%' },
    { month: 'Mar', value: 80, height: '80%' },
    { month: 'Apr', value: 81, height: '81%' },
    { month: 'May', value: 76, height: '76%' },
    { month: 'Jun', value: 85, height: '85%' },
    { month: 'Jul', value: 90, height: '90%' },
    { month: 'Aug', value: 87, height: '87%' },
    { month: 'Sep', value: 91, height: '91%' },
    { month: 'Oct', value: 95, height: '95%' },
    { month: 'Nov', value: 92, height: '92%' },
    { month: 'Dec', value: 99, height: '99%' }
  ];

  constructor(
    private collectionsService: CollectionsService, 
    private auctionsService: AuctionsService,
    private categoriesService: CategoriesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
    this.collectionsService.getCollections(0, 8).subscribe({
      next: (response: ApiResponse<PaginatedApiResponse<Collection>>) => {
        this.collections = response.data.content;
        this.displayedCollections = this.collections.slice(0, 4);
      },
      error: (error) => {
        console.error('Error fetching collections:', error);
      }
    });
    
    this.auctionsService.getLiveAuctions().subscribe({
      next: (response) => {
        this.liveAuctions = response.data.content;
      },
      error: (error) => console.error('Error fetching live auctions:', error)
    });

    this.categoriesService.getCategories().subscribe({
      next: (response: ApiResponse<Category[]>) => {
        this.categories = response.data;
      },
      error: (error) => console.error('Error fetching categories:', error)
    });

    this.loadTopSellers(this.selectedDuration.value);
  }

  goToCategoryAuctions(category: Category): void {
    this.router.navigate(['/explore-auctions'], { queryParams: { categoryId: category.id } });
  }

  viewDetails(item: AuctionVm): void {
    console.log('Viewing details for:', item);
  }

  toggleShowMore(): void {
    this.showMore = !this.showMore;
    this.displayedCollections = this.collections.slice(0, this.showMore ? 8 : 4);
  }

  toggleAuctionsShowMore(): void {
    this.auctionsShowMore = !this.auctionsShowMore;
  }
  trackLot(item: AuctionVm): void {
    console.log('Tracking lot:', item);
  }

  browseAllCollections(): void {
    this.router.navigate(['/collections']);
  }

  browseAllAuctions(): void {
    this.router.navigate(['/explore-auctions']);
  }

  browseAllCreators() {
    console.log("Navigating to all top sellers page...");
    this.router.navigate(['/creators']);
}


  toggleDurationDropdown() {
    this.showDurationDropdown = !this.showDurationDropdown;
  }
  
  selectDuration(duration: any) {
    this.selectedDuration = duration;
    this.showDurationDropdown = false;
    this.loadTopSellers(duration.value); 
  }
  
  loadTopSellers(durationValue: string) {
    this.auctionsService.getOwnerRanking(durationValue, 0, 10).subscribe({
      next: (response) => {
        this.topOwners = response.data.content;
      },
      error: (error) => console.error('Error fetching rankings:', error)
    });
  }
}
