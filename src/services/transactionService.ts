import apiClient from '../lib/api-client';
import { Transaction } from '../types/transaction';

export interface TransactionFilters {
  page?: number;
  limit?: number;
  category?: string;
  type?: 'income' | 'expense';
  month?: number;
  year?: number;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    type: string;
  }[];
}

export interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

// Helper function to convert date strings to Date objects
const convertDates = (transaction: any): Transaction => {
  return {
    ...transaction,
    date: new Date(transaction.date),
    createdAt: new Date(transaction.createdAt),
  };
};

export const transactionService = {
  async getTransactions(filters?: TransactionFilters): Promise<PaginatedResponse> {
    const response = await apiClient.get('/transactions', { params: filters });
    const transactions = response.data.data.transactions.map(convertDates);
    return {
      ...response.data.data,
      transactions,
    };
  },

  async getTransactionById(id: string): Promise<Transaction> {
    const response = await apiClient.get(`/transactions/${id}`);
    return convertDates(response.data.data.transaction);
  },

  async createTransaction(data: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const response = await apiClient.post('/transactions', data);
    return convertDates(response.data.data.transaction);
  },

  async updateTransaction(id: string, data: Partial<Omit<Transaction, 'id' | 'createdAt'>>): Promise<Transaction> {
    const response = await apiClient.put(`/transactions/${id}`, data);
    return convertDates(response.data.data.transaction);
  },

  async deleteTransaction(id: string): Promise<void> {
    await apiClient.delete(`/transactions/${id}`);
  },

  async getTransactionStats(): Promise<TransactionStats> {
    const response = await apiClient.get('/transactions/stats');
    return response.data.data;
  },

  async getMonthlyStats(): Promise<MonthlyStats[]> {
    const response = await apiClient.get('/transactions/monthly');
    return response.data.data.monthlyStats;
  },

  async exportTransactions(format: 'csv' | 'json', filters?: TransactionFilters): Promise<Blob> {
    const response = await apiClient.get('/transactions/export', {
      params: { ...filters, format },
      responseType: 'blob',
    });
    return response.data;
  },
};
