import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { AuctionVm } from '../../models/view-models/auction-vm.model';
import { AuctionsService } from '../../services/auctions.service';
import { ToastService } from '../../services/toast.service';
import { finalize } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RejectDialogComponent } from '../../components/reject-dialog/reject-dialog.component';
import { AuctionRequestsTableComponent } from '../../components/auction-requests-table/auction-requests-table.component';
import { AuctionStats } from '../../models/view-models/auctions-stats-vm';


@Component({
  selector: 'app-auctions-dash',
  standalone: true,
  imports: [CommonModule, StatsCardComponent, ToastModule, MatPaginatorModule, MatIconModule, AuctionRequestsTableComponent],
  templateUrl: './auctions-dash.component.html',
  styleUrl: './auctions-dash.component.css',
  providers: [ToastService]
})
export class AuctionsDashComponent {

  auctionRequests: AuctionVm[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  isLoading: boolean = false;
  stats: AuctionStats = {
    totalAuctions: 0,
    pendingRequests: 0,
    activeUsers: 0,
    totalRevenue: 0
  };

  constructor(private auctionsService: AuctionsService, private toastService: ToastService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadPendingAuctions();
    this.loadStats();
  }

  loadStats(): void {
    this.auctionsService.getAuctionsStats().subscribe({
      next: (res) => {
        this.stats = res.data;
      },
      error: (err) => {
        this.toastService.showError('Error', 'Failed to load stats');
      }
    });
  }

  loadPendingAuctions(): void {
    this.auctionsService.getPendingAuctions(this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          this.auctionRequests = res.data.content;
          this.totalItems = res.data.page.totalElements;
        },
        error: (err) => {
          this.toastService.showError('Error', 'Failed to load auctions');
        }
      });
  }

  approveAuction(auction: AuctionVm): void {
    this.isLoading = true;
    this.auctionsService.approveAuction(auction.id)
      .subscribe({
        next: (res) => {
          this.toastService.showSuccess('Success', 'Auction approved successfully');
          // Remove from the list or reload
          this.loadPendingAuctions();
        },
        error: (err) => {
          this.toastService.showError('Error', 'Failed to approve auction');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  openRejectDialog(auction: AuctionVm): void {
    const dialogRef = this.dialog.open(RejectDialogComponent, {
      width: '400px',
      data: { auction }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.reason) {
        this.rejectAuction(auction.id, result.reason);
      }
    });
  }

  private rejectAuction(auctionId: string, reason: string): void {
    this.isLoading = true;
    this.auctionsService.rejectAuction(auctionId, reason)
      .subscribe({
        next: (res) => {
          this.toastService.showSuccess('Success', 'Auction rejected successfully');
          // Remove from the list or reload
          this.loadPendingAuctions();
        },
        error: (err) => {
          this.toastService.showError('Error', 'Failed to reject auction');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPendingAuctions();
  }

  openAuctionDetails(auction: AuctionVm): void {
    // Navigate to auction details or open a dialog
    console.log('Opening auction details for:', auction.id);
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
