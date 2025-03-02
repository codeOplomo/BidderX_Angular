export interface TransactionVM {
    id: string;
    amount: number;
    transactionDate: Date;
    description: string;
    type: 'DEPOSIT' | 'WITHDRAWAL';
  }