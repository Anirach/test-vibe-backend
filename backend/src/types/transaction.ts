export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionCategory {
  FOOD = 'Food',
  TRAVEL = 'Travel',
  BILLS = 'Bills',
  SHOPPING = 'Shopping',
  ENTERTAINMENT = 'Entertainment',
  HEALTHCARE = 'Healthcare',
  SALARY = 'Salary',
  FREELANCE = 'Freelance',
  INVESTMENT = 'Investment',
  OTHER = 'Other',
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: Date | string;
}

export interface UpdateTransactionDTO {
  type?: TransactionType;
  amount?: number;
  category?: TransactionCategory;
  description?: string;
  date?: Date | string;
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  type?: TransactionType;
  month?: number;
  year?: number;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    type: TransactionType;
  }[];
}

export interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
  balance: number;
}
