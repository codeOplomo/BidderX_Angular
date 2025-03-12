import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { BidSummaryComponent } from "../bid-summary/bid-summary.component";
import { BidVM } from '../../models/view-models/bid-vm';
import { BidsService } from '../../services/bids.service';

interface Property {
  label: string;
  value: string;
  type: 'rare' | 'common' | 'epic' | 'legendary';
}

@Component({
  selector: 'app-product-tabs',
  standalone: true,
  imports: [CommonModule, BidSummaryComponent],
  templateUrl: './product-tabs.component.html',
  styleUrl: './product-tabs.component.css'
})
export class ProductTabsComponent {
  @Input() auctionId!: string;
  @Input() auctionEnded: boolean = false;
  private refreshInterval: any;

  activeTab = 'Details';
  tabs = ['Bids', 'Details', 'History'];

  allBids:BidVM[] =[];
  userBids:BidVM[] =[];

  properties: Property[] = [
    { label: 'HYPE TYPE', value: 'CALM AF (STILL)', type: 'rare' },
    { label: 'BASTARDNESS', value: 'COOLIO BASTARD', type: 'epic' },
    { label: 'TYPE', value: 'APE', type: 'legendary' },
    { label: 'ASTARDNESS', value: 'BASTARD', type: 'rare' },
    { label: 'BAD HABIT(S)', value: 'PIPE', type: 'epic' },
    { label: 'BID', value: 'BPEYtl', type: 'legendary' },
    { label: 'ASTRAGENAKAR', value: 'BASTARD', type: 'rare' },
    { label: 'CITY', value: 'TOKYO', type: 'epic' }
  ];

  constructor(private bidsService: BidsService) {}

  ngOnInit(): void {
    this.loadBids();
    if (!this.auctionEnded) {
      this.setupAutoRefresh();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['auctionEnded'] && changes['auctionEnded'].currentValue === true) {
      // Auction ended: clear auto-refresh if it's running
      this.clearAutoRefresh();
    }
  }

  ngOnDestroy(): void {
    this.clearAutoRefresh();
  }

  public loadBids(): void {
    // Fetch all bids
    this.bidsService.getAllBids(this.auctionId).subscribe(response => {
      this.allBids = response.data.content;
    });

    // Fetch user bids
    this.bidsService.getUserBids(this.auctionId).subscribe(response => {
      this.userBids = response.data.content;
    });
  }

  private setupAutoRefresh(): void {
    this.refreshInterval = setInterval(() => {
      this.loadBids();
    }, 3000); // Refresh every 3 seconds
  }

  private clearAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
