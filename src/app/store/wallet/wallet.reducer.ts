// wallet.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as WalletActions from './wallet.actions';
import { WalletVM } from '../../models/view-models/wallet-vm';

// Helper function for wallet parsing
const parseWallet = (wallet: WalletVM): WalletVM => ({
  ...wallet,
  balance: Number(wallet.balance),
  transactions: wallet.transactions || []
});

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
    wallet: parseWallet(wallet),
    loading: false
  })),
  on(WalletActions.updateWalletBalance, (state, { newBalance }) => ({
    ...state,
    wallet: state.wallet ? {
      ...state.wallet,
      balance: newBalance
    } : null
  })),
  on(WalletActions.loadWalletFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(WalletActions.connectWallet, state => ({
    ...state,
    loading: true
  })),
  on(WalletActions.connectWalletSuccess, (state, { wallet }) => ({
    ...state,
    wallet: parseWallet(wallet),
    loading: false
  })),
  on(WalletActions.depositFunds, state => ({
    ...state,
    loading: true
  })),
  on(WalletActions.depositFundsSuccess, (state, { wallet }) => ({
    ...state,
    wallet: parseWallet(wallet),
    loading: false
  }))
);