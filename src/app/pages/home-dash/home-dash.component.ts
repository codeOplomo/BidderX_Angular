import { Component } from '@angular/core';
import { AuctionStats } from '../../models/view-models/auctions-stats-vm';
import { AuctionsService } from '../../services/auctions.service';
import { ToastService } from '../../services/toast.service';
import { ToastModule } from 'primeng/toast';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { ChartStatsComponent } from '../../components/chart-stats/chart-stats.component';
import { AuctionStatusChartComponent } from '../../components/auction-status-chart/auction-status-chart.component';

@Component({
  selector: 'app-home-dash',
  standalone: true,
  imports: [ToastModule, StatsCardComponent, ChartStatsComponent, AuctionStatusChartComponent],
  templateUrl: './home-dash.component.html',
  styleUrl: './home-dash.component.css',
  providers: [ToastService]
})
export class HomeDashComponent {
  
    isLoading: boolean = false;
    stats: AuctionStats = {
      totalAuctions: 30,
      pendingRequests: 40,
      activeAuctions: 110,
      completedAuctions: 10,
      averageWinningBid: 130,
      averageBidSpread: 30,
      revenuePerOwner: {},
      activeUsers: 45,
      totalRevenue: 67,
      ongoingAuctions: 77,
      totalBids: 550,
      todayRevenue: 74,
      averageBidAmount: 44,
      totalLikes: 600,
    };

      constructor(private auctionsService: AuctionsService, private toastService: ToastService) { }
    

    ngOnInit(): void {
      this.loadStats();
    }

    loadStats(): void {
      this.isLoading = true;
      this.auctionsService.getAuctionsStats().subscribe({
        next: (res) => {
          // Replace nulls with 0 for chart compatibility
          this.stats = {
            ...res.data,
            averageWinningBid: res.data.averageWinningBid ?? 0,
            averageBidSpread: res.data.averageBidSpread ?? 0
          };
          this.isLoading = false;
        },
        error: (err) => {
          this.toastService.showError('Error', 'Failed to load stats');
          this.isLoading = false;
        }
      });
    }
    
}
