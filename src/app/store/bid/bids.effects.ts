// bids.effects.ts
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { selectWalletBalance } from '../wallet/wallet.selectors';
import * as WalletActions from '../wallet/wallet.actions';
import * as BidActions from './bid.actions';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';


@Injectable()
export class UserEffects {
      private readonly actions$ = inject(Actions);
    
    private readonly store = inject(Store);

placeBidSuccess$ = createEffect(() => {
  return this.actions$.pipe(
    ofType(BidActions.placeBidSuccess),
    withLatestFrom(this.store.select(selectWalletBalance)),
    switchMap(([action, currentBalance]) => {
      const newBalance = currentBalance - action.bidAmount;
      return [
        // Update wallet balance globally
        WalletActions.updateWalletBalance({ newBalance }),
        // Add other refresh actions if needed
        // AuctionActions.refreshAuction({ auctionId: action.auctionId })
      ];
    })
  );
});}