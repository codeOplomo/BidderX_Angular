import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AuctionVm } from '../../models/view-models/auction-vm.model';

@Component({
  selector: 'app-place-bid-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './place-bid-card.component.html',
  styleUrl: './place-bid-card.component.css'
})
export class PlaceBidCardComponent {
  // @Input() auction: AuctionVm;
  // Add these properties
auctionEnded = false;
auctionNotStarted = false;
countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
private countdownInterval: any;

// Add this to ngOnInit
ngOnInit(): void {
  this.startCountdown();
}

ngOnDestroy(): void {
  if (this.countdownInterval) {
    clearInterval(this.countdownInterval);
  }
}

private startCountdown(): void {
  this.countdownInterval = setInterval(() => {
    this.updateCountdown();
  }, 1000);
  this.updateCountdown();
}

private updateCountdown(): void {
  const now = new Date();
  const endDate = new Date();
  
  if (now > endDate) {
    this.auctionEnded = true;
    clearInterval(this.countdownInterval);
    return;
  }

  const diff = endDate.getTime() - now.getTime();
  
  this.countdown.days = Math.floor(diff / (1000 * 60 * 60 * 24));
  this.countdown.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  this.countdown.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  this.countdown.seconds = Math.floor((diff % (1000 * 60)) / 1000);
}
}
