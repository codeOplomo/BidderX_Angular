import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuctionVm } from '../../models/view-models/auction-vm.model';
import { StatsCardComponent } from "../../components/stats-card/stats-card.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, StatsCardComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  totalAuctions: number = 157;
  pendingRequests: number = 12;
  activeUsers: number = 2453;
  totalRevenue: number = 134500;
  
  auctionRequests: AuctionVm[] = [
  ];

  constructor() { }

  ngOnInit(): void {
  }

  newAuction(): void {
    console.log('Creating new auction');
  }

  approveRequests(): void {
    console.log('Approving requests');
  }

  generateReport(): void {
    console.log('Generating report');
  }
}
