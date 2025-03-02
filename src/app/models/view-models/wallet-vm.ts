import { TransactionVM } from "./transaction-vm";

export interface WalletVM {
    id: string;
    balance: number;
    userId: string;
    transactions: TransactionVM[];
  }