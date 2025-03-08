// wallet.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as WalletActions from './wallet.actions';
import { WalletVM } from '../../models/view-models/wallet-vm';

export interface State {
  wallet: WalletVM | null;
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  wallet: null,
  loading: false,
  error: null
};

export const walletReducer = createReducer(
  initialState,
  on(WalletActions.loadWallet, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(WalletActions.loadWalletSuccess, (state, { wallet }) => ({
    ...state,
    wallet,
    loading: false
  })),
  on(WalletActions.updateWalletBalance, (state, { newBalance }) => ({
    ...state,
    wallet: state.wallet ? { ...state.wallet, balance: newBalance } : null
  }))
);