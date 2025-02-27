import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.css'
})
export class StatsCardComponent {
  @Input() totalAuctions: number = 0;
  @Input() pendingRequests: number = 0;
  @Input() activeUsers: number = 0;
  @Input() totalRevenue: number = 0;
}
