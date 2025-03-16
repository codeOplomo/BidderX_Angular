import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AuctionVm } from '../../models/view-models/auction-vm.model';
import { CommonModule } from '@angular/common';
import { ImagesService } from '../../services/images.service';
import { CardModule } from 'primeng/card';
import { AuctionRectionsService } from '../../services/auction-rections.service';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CountdownService } from '../../services/countdown.service';
import { UniquePipe } from '../../pipes/unique.pipe';

@Component({
  selector: 'app-auction-card',
  standalone: true,
  imports: [CommonModule, CardModule, AvatarModule, TooltipModule, RouterModule, UniquePipe],
  templateUrl: './auction-card.component.html',
  styleUrl: './auction-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuctionCardComponent implements OnInit, OnDestroy {
  @Input() auction!: AuctionVm;
  @Output() likeToggled = new EventEmitter<AuctionVm>();

  countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  likes: number = 0;
  isLiked: boolean = false;
  private intervalId: any;
  private destroy$ = new Subject<void>();

  constructor(
    private imagesService: ImagesService,
    private auctionReactionsService: AuctionRectionsService,
    private countdownService: CountdownService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.auction?.endTime) {
      this.updateCountdown(); // Initial update
      this.countdownService.tick$
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.updateCountdown());
    }

    this.auction = {
      ...this.auction,
      bidders: this.auction.bidders || [] // Fallback to empty array if undefined
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['auction']) {
      const currentAuction = changes['auction'].currentValue;
      const previousAuction = changes['auction'].previousValue;
  
      // Only update state if it's a different auction
      if (!previousAuction || currentAuction.id !== previousAuction.id) {
        this.likes = currentAuction.reactionsCount;
        this.isLiked = currentAuction.likedByCurrentUser;
      }
    }
  }

  toggleLike(): void {
    const previousLikes = this.likes;
    const previousIsLiked = this.isLiked;
  
    // Optimistic update
    this.isLiked = !this.isLiked;
    this.likes += this.isLiked ? 1 : -1;
  
    this.auctionReactionsService.toggleLike(this.auction.id).subscribe({
      next: (response) => {
        // Assuming response is { data: { totalLikes: number, hasLiked: boolean } }
        this.likes = response.data.totalLikes;
        this.isLiked = response.data.hasLiked;
        this.auction.reactionsCount = response.data.totalLikes;
        this.auction.likedByCurrentUser = response.data.hasLiked;
        this.likeToggled.emit(this.auction);
      },
      error: (error) => {
        console.error('Error toggling like:', error);
        this.revertLikeState(previousLikes, previousIsLiked);
      }
    });
  }

  private revertLikeState(likes: number, isLiked: boolean): void {
    this.likes = likes;
    this.isLiked = isLiked;
    this.auction.reactionsCount = likes;
    this.auction.likedByCurrentUser = isLiked;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startCountdown(): void {
    this.updateCountdown();
    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  private updateCountdown(): void {
    const endTimeStr = this.auction.endTime!.endsWith('Z') 
      ? this.auction.endTime! 
      : `${this.auction.endTime}Z`; // Append 'Z' for UTC
    const endDate = new Date(endTimeStr);
    const endTime = endDate.getTime();
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance < 0) {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      this.cd.markForCheck(); // Trigger change detection
      return;
    }

    this.countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    this.cd.markForCheck(); // Trigger change detection for OnPush
  }

  
  getImageUrl(imageUrl?: string): string {
    return imageUrl?.trim() ? this.imagesService.getImageUrl(imageUrl) : 'https://picsum.photos/400/300?random=1';
  }

  goToProductDetail(productId?: string): void {
    this.router.navigate(['/product-detail', productId]);
  }

  goToProfile(email: string | undefined): void {
    if (email) {
      this.router.navigate(['/profile', email]);
    }
  }
}
