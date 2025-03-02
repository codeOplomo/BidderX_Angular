import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuctionVm } from '../../models/view-models/auction-vm.model';
import { PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { AuctionDetailDialogComponent } from '../auction-detail-dialog/auction-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-auction-requests-table',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, MatPaginatorModule, CommonModule],
  templateUrl: './auction-requests-table.component.html',
  styleUrl: './auction-requests-table.component.css'
})
export class AuctionRequestsTableComponent {
  @Input() auctionRequests: AuctionVm[] = [];
  @Input() currentPage: number = 0;
  @Input() pageSize: number = 10;
  @Input() totalItems: number = 0;
  
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() approve = new EventEmitter<AuctionVm>();
  @Output() reject = new EventEmitter<AuctionVm>();
  @Output() viewDetails = new EventEmitter<AuctionVm>();

  constructor(private dialog: MatDialog) {}

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  onApprove(auction: AuctionVm, event: Event) {
    event.stopPropagation();
    this.approve.emit(auction);
  }

  onReject(auction: AuctionVm, event: Event) {
    event.stopPropagation();
    this.reject.emit(auction);
  }

  onRowClick(auction: AuctionVm) {
    this.viewDetails.emit(auction);
    
    const dialogRef = this.dialog.open(AuctionDetailDialogComponent, {
      width: '1100px',  // increased dialog width
      data: auction
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'approve') {
          this.approve.emit(result.auction);
        } else if (result.action === 'reject') {
          this.reject.emit(result.auction);
        }
      }
    });
  }
  
}
