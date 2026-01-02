
export enum TransactionType {
  RECEIPT = 'RECEIPT',
  PAYMENT = 'PAYMENT',
  BANK_ENTRY = 'BANK_ENTRY'
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
}

export interface FinancialSummary {
  totalReceipts: number;
  totalPayments: number;
  bankBalance: number;
  netCashFlow: number;
}

export interface DailySummary {
  date: string;
  receipts: number;
  payments: number;
  net: number;
  transactions: Transaction[];
}

export interface ChartData {
  name: string;
  value: number;
}
