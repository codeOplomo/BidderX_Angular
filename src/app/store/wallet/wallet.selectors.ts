// wallet.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './wallet.reducer';

export const selectWalletState = createFeatureSelector<State>('wallet');

export const selectWallet = createSelector(
  selectWalletState,
  (state) => state.wallet
);

export const selectWalletBalance = createSelector(
  selectWallet,
  (wallet) => wallet?.balance || 0
);