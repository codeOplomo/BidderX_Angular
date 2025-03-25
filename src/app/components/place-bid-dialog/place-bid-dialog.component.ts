import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { BidsService } from '../../services/bids.service';
import { BidRequest } from '../../models/view-models/bid-request';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectWalletBalance } from '../../store/wallet/wallet.selectors';
import { finalize, map, Observable, take, tap } from 'rxjs';
import * as WalletActions from '../../store/wallet/wallet.actions';
import { Router } from '@angular/router';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { selectUser } from '../../store/user/user.selectors';

@Component({
  selector: 'app-place-bid-dialog',
  standalone: true,
  imports: [DialogModule, CommonModule, FormsModule],
  templateUrl: './place-bid-dialog.component.html',
  styleUrl: './place-bid-dialog.component.css'
})
export class PlaceBidDialogComponent {
  @Input() minimumBid: number = 0;
  @Input() auctionId: string | undefined = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() bidSubmitted = new EventEmitter<number>();

  private _visible = false;

  isAuthenticated$: Observable<boolean>;
  hasWallet$: Observable<boolean>;
  
  @Input()
  get visible(): boolean {
    return this._visible;
  }
  set visible(value: boolean) {
    if (this._visible !== value) {
      this._visible = value;
      this.visibleChange.emit(value);
    }
  }


  walletBalance$: Observable<number>;
  insufficientBalance = false;

  bidAmount?: number;
  loading = false;

  constructor(private store: Store, private router: Router) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.hasWallet$ = this.store.select(selectUser).pipe(
      map(user => user?.hasWallet || false)
    );
    this.walletBalance$ = this.store.select(selectWalletBalance);
  }
  
  ngOnInit() {
    this.store.dispatch(WalletActions.loadWallet());
  }

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
        this.bidAmount = undefined;
      } else {
        this.insufficientBalance = true;
        this.loading = false;
      }
    }),
    finalize(() => this.loading = false)
  ).subscribe();
}

  public validateBid(): boolean {
    return !!this.bidAmount && this.bidAmount >= this.minimumBid;
  }

  navigateTo(route: string): void {
    this.visible = false;
    this.router.navigate([route]);
  }

  onClose() {
    this.visible = false;
    this.resetForm();
  }

  resetForm() {
    this.bidAmount = undefined;
    this.loading = false;
  }
}
