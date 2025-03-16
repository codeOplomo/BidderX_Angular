import { Component, Input } from '@angular/core';
import { BidVM } from '../../models/view-models/bid-vm';
import { ImagesService } from '../../services/images.service';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bid-summary',
  standalone: true,
  imports: [TimeAgoPipe, CommonModule],
  templateUrl: './bid-summary.component.html',
  styleUrl: './bid-summary.component.css'
})
export class BidSummaryComponent {
  @Input() bid!: BidVM;

  constructor(private imagesService: ImagesService, private router: Router) {  }
  
  
  navigateToProfile() {
    const encodedEmail = encodeURIComponent(this.bid.bidder.email);
    this.router.navigate(['/profile', encodedEmail]);
  }

  getImageUrl(imagePath: string): string {
    return this.imagesService.getImageUrl(imagePath);
  }
}
