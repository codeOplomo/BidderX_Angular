import { Component, Input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { AuctionStats } from '../../models/view-models/auctions-stats-vm';

@Component({
  selector: 'app-auction-status-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './auction-status-chart.component.html',
  styleUrl: './auction-status-chart.component.css'
})
export class AuctionStatusChartComponent {
  @Input() stats!: AuctionStats;

  statusChartData: any;
  statusChartOptions: any;

  ngOnChanges(): void {
    if (this.stats) {
      this.statusChartData = {
        labels: ['Active', 'Completed', 'Ongoing', 'Pending'],
        datasets: [{
          data: [
            this.stats.activeAuctions,
            this.stats.completedAuctions,
            this.stats.ongoingAuctions,
            this.stats.pendingRequests
          ],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350'],
        }]
      };

      this.statusChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
      };
    }
  }
}
