export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'Food' 
  | 'Travel' 
  | 'Bills' 
  | 'Shopping' 
  | 'Entertainment' 
  | 'Healthcare'
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
  balance: number;
}
