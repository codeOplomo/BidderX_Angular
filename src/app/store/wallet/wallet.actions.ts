// wallet.actions.ts
import { createAction, props } from '@ngrx/store';
import { WalletVM } from '../../models/view-models/wallet-vm';

export const loadWallet = createAction('[Wallet] Load Wallet');
export const loadWalletSuccess = createAction(
  '[Wallet] Load Wallet Success',
  props<{ wallet: WalletVM }>()
);
export const loadWalletFailure = createAction(
  '[Wallet] Load Wallet Failure',
  props<{ error: string }>()
);
export const updateWalletBalance = createAction(
  '[Wallet] Update Balance',
  props<{ newBalance: number }>()
);