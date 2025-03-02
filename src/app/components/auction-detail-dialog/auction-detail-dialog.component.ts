import { Component, Inject } from '@angular/core';
import { AuctionVm } from '../../models/view-models/auction-vm.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-auction-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './auction-detail-dialog.component.html',
  styleUrl: './auction-detail-dialog.component.css'
})
export class AuctionDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AuctionDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public auction: AuctionVm,
    private imagesService: ImagesService
  ) {}
  
  closeDialog(): void {
    this.dialogRef.close();
  }
  
  approveAuction(): void {
    this.dialogRef.close({ action: 'approve', auction: this.auction });
  }
  
  rejectAuction(): void {
    this.dialogRef.close({ action: 'reject', auction: this.auction });
  }

  getImageUrl(imageUrl?: string): string {
    return imageUrl?.trim() ? this.imagesService.getImageUrl(imageUrl) : 'https://picsum.photos/400/300?random=1';
  }
}
