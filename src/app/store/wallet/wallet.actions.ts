// wallet.actions.ts
import { createAction, props } from '@ngrx/store';
import { WalletVM } from '../../models/view-models/wallet-vm';
import { ConnectWalletRequest } from '../../models/view-models/connect-wallet-request';
import { DepositRequest } from '../../models/view-models/deposit-request';


export const connectWallet = createAction(
    '[Wallet] Connect Wallet',
    props<{ request: ConnectWalletRequest }>()
  );
  
  export const connectWalletSuccess = createAction(
    '[Wallet] Connect Wallet Success',
    props<{ wallet: WalletVM }>()
  );
  
  export const connectWalletFailure = createAction(
    '[Wallet] Connect Wallet Failure',
    props<{ error: string }>()
  );
  
  export const depositFunds = createAction(
    '[Wallet] Deposit Funds',
    props<{ request: DepositRequest }>()
  );
  
  export const depositFundsSuccess = createAction(
    '[Wallet] Deposit Funds Success',
    props<{ wallet: WalletVM }>()
  );
  
  export const depositFundsFailure = createAction(
    '[Wallet] Deposit Funds Failure',
    props<{ error: string }>()
  );

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
export const resetWalletState = createAction('[Wallet] Reset State');