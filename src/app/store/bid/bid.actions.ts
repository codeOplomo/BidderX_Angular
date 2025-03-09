
import { createAction, props } from '@ngrx/store';

export const placeBid = createAction(
  '[Bid] Place Bid',
  props<{ auctionId: string; bidAmount: number }>()
);

export const placeBidSuccess = createAction(
  '[Bid] Place Bid Success',
  props<{ bidAmount: number; auctionId: string }>()
);

export const placeBidFailure = createAction(
  '[Bid] Place Bid Failure',
  props<{ error: string }>()
);