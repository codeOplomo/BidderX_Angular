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
    // Add fallback icon for unknown categories
    'default': 'category'
  };
  showMore: boolean = false; 

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

    this.auctionsService.getOwnerRanking('1d', 0, 10).subscribe({
      next: (response) => {
        this.topOwners = response.data.content.slice(0, 10); 
      },
      error: (error) => console.error('Error fetching rankings:', error)
    });
    
    this.categoriesService.getCategories().subscribe({
      next: (response: ApiResponse<Category[]>) => {
        this.categories = response.data;
      },
      error: (error) => console.error('Error fetching categories:', error)
    });
  }

  goToCategoryAuctions(category: Category): void {
    // Navigate to the auctions page, passing the category name as a query parameter.
    this.router.navigate(['/explore-auctions'], { queryParams: { categoryId: category.id } });
  }

  viewDetails(item: AuctionVm): void {
    // Implement view details logic
    console.log('Viewing details for:', item);
  }

  toggleShowMore(): void {
    this.showMore = !this.showMore;
    // This is the key change: we update the displayed collections array
    // which will trigger the animation for the new cards
    this.displayedCollections = this.collections.slice(0, this.showMore ? 8 : 4);
  }
  trackLot(item: AuctionVm): void {
    // Implement track lot logic
    console.log('Tracking lot:', item);
  }

  browseAllAuctions(): void {
    // Implement browse all auctions navigation
    console.log('Browsing all auctions');
  }
}
