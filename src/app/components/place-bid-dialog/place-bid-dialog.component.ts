import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { BidsService } from '../../services/bids.service';
import { BidRequest } from '../../models/view-models/bid-request';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectWalletBalance } from '../../store/wallet/wallet.selectors';
import { Observable, take, tap } from 'rxjs';
import * as WalletActions from '../../store/wallet/wallet.actions';

@Component({
  selector: 'app-place-bid-dialog',
  standalone: true,
  imports: [DialogModule, CommonModule, FormsModule],
  templateUrl: './place-bid-dialog.component.html',
  styleUrl: './place-bid-dialog.component.css'
})
export class PlaceBidDialogComponent {
  @Input() visible: boolean = false;
  @Input() minimumBid: number = 0;
  @Input() auctionId: string | undefined = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() bidSubmitted = new EventEmitter<number>();

  walletBalance$: Observable<number>;
  insufficientBalance = false;

  bidAmount?: number;
  loading = false;

  constructor(private store: Store) {
    
    this.walletBalance$ = this.store.select(selectWalletBalance);
    // this.walletBalance$.subscribe(balance => {
    //   console.log('Current Wallet Balance:', balance);
    // });
  }
  
  ngOnInit() {
    this.store.dispatch(WalletActions.loadWallet());
  }

  // place-bid-dialog.component.ts
submitBid() {
  this.walletBalance$.pipe(
    take(1),
    tap(balance => {
      if (this.validateBid() && this.bidAmount! <= balance) {
        const newBalance = balance - this.bidAmount!;
        
        this.store.dispatch(WalletActions.updateWalletBalance({ 
          newBalance 
        }));
        
        this.loading = true;
        this.bidSubmitted.emit(this.bidAmount);
        this.insufficientBalance = false;
      } else {
        this.insufficientBalance = true;
      }
    })
  ).subscribe();
}

  private validateBid(): boolean {
    return !!this.bidAmount && this.bidAmount >= this.minimumBid;
  }

  onClose() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  resetForm() {
    this.bidAmount = undefined;
    this.loading = false;
  }
}
