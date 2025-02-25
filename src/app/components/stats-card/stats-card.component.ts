import { Component } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.css'
})
export class StatsCardComponent {
  totalAuctions: number = 157;
  pendingRequests: number = 12;
  activeUsers: number = 2453;
  totalRevenue: number = 134500;
}
