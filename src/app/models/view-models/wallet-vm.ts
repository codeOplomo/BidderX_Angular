import { TransactionVM } from "./transaction-vm";

export interface WalletVM {
    id: string;
    type: 'fiat' | 'crypto';
    balance: number;
    currencyCode: string;
    userId: string;
    checkoutUrl: string;
    transactions: TransactionVM[];
  }