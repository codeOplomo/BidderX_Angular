import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { AuctionVm } from '../../models/view-models/auction-vm.model';
import { AuthService } from '../../services/auth.service';
import { PlaceBidDialogComponent } from "../place-bid-dialog/place-bid-dialog.component";
import { BidRequest } from '../../models/view-models/bid-request';
import { BidsService } from '../../services/bids.service';
import { FormsModule } from '@angular/forms';
import { loadWallet } from '../../store/wallet/wallet.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-place-bid-card',
  standalone: true,
  imports: [CommonModule, PlaceBidDialogComponent, FormsModule],
  templateUrl: './place-bid-card.component.html',
  styleUrl: './place-bid-card.component.css'
})
export class PlaceBidCardComponent {
  @Input() auction!: AuctionVm;
  showBidDialog = false;
auctionEnded = false;
auctionNotStarted = false;
countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
private countdownInterval: any;

constructor(private authService: AuthService, private bidsService: BidsService, private store: Store) {}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['auction']) {
    this.updateCountdown();
  }
}

ngOnInit(): void {
  this.startCountdown();
}

openBidDialog() {
  this.showBidDialog = true;
}

onBidSubmitted(bidAmount: number) {
  const bidRequest: BidRequest = {
    auctionId: this.auction.id,
    bidAmount: bidAmount
  };

  this.bidsService.placeBid(bidRequest).subscribe({
    next: (response) => {
      this.store.dispatch(loadWallet());
      // this.store.dispatch(loadAuctionDetails({ auctionId: this.auction.id }));
      console.log('Bid placed successfully:', response);
      this.showBidDialog = false; // Close the dialog after success
      // Optionally, refresh your auction data or update current bid info here.
    },
    error: (error) => {
      console.error('Error placing bid:', error);
      // Optionally display an error message.
    }
  });
}
ngOnDestroy(): void {
  if (this.countdownInterval) {
    clearInterval(this.countdownInterval);
  }
}

isOwner(): boolean {
  return this.authService.hasRole('OWNER');
}

isBidder(): boolean {
  return this.authService.hasRole('BIDDER');
}

private startCountdown(): void {
  this.countdownInterval = setInterval(() => {
    this.updateCountdown();
  }, 1000);
  this.updateCountdown();
}

private updateCountdown(): void {
  if (!this.auction) return;

  const now = new Date();
  const startDate = new Date(this.auction.startTime);
  const endDate = new Date(this.auction.endTime);

  // Handle pending status
  if (this.auction.status === 'PENDING') {
    this.auctionEnded = false;
    this.auctionNotStarted = false;
    clearInterval(this.countdownInterval);
    return;
  }

  // Handle time calculations only for APPROVED auctions
  if (now < startDate) {
    this.auctionNotStarted = true;
    this.calculateTimeDifference(now, startDate);
  } else if (now > endDate) {
    this.auctionEnded = true;
    clearInterval(this.countdownInterval);
  } else {
    this.auctionNotStarted = false;
    this.calculateTimeDifference(now, endDate);
  }
}

private calculateTimeDifference(now: Date, targetDate: Date): void {
  const diff = targetDate.getTime() - now.getTime();
  
  this.countdown.days = Math.floor(diff / (1000 * 60 * 60 * 24));
  this.countdown.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  this.countdown.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  this.countdown.seconds = Math.floor((diff % (1000 * 60)) / 1000);
}
}
