import { Component, Input } from '@angular/core';
import { AuctionStats } from '../../models/view-models/auctions-stats-vm';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-chart-stats',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './chart-stats.component.html',
  styleUrl: './chart-stats.component.css'
})
export class ChartStatsComponent {
  @Input() stats!: AuctionStats;

  chartData: any;
  chartOptions: any;

  // In your chart component (e.g., ChartStatsComponent)
get revenueData() {
  return Object.keys(this.stats.revenuePerOwner).length > 0 
    ? this.stats.revenuePerOwner 
    : { 'No Revenue Yet': 0 }; // Fallback
}

  ngOnChanges(): void {
    if (this.stats && this.stats.revenuePerOwner) {
      const labels = Object.keys(this.stats.revenuePerOwner);
      const revenues = Object.values(this.stats.revenuePerOwner);
  
      if (labels.length === 0) {
        this.chartData = {
          labels: ['No Data'],
          datasets: [
            {
              label: 'Revenue Per Owner',
              backgroundColor: '#ccc',
              data: [0]
            }
          ]
        };
      } else {
        this.chartData = {
          labels: labels,
          datasets: [
            {
              label: 'Revenue Per Owner',
              backgroundColor: '#42A5F5',
              data: revenues
            }
          ]
        };
  
        this.chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'X Axis Label'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Y Axis Label'
              }
            }
        }
      }
    }
  }
  
  }
}
