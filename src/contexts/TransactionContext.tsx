import React, { createContext, useContext, useEffect, useState } from 'react';
import { Transaction } from '@/types/transaction';
import { transactionService } from '@/services/transactionService';
import { useToast } from '@/hooks/use-toast';

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionService.getTransactions({ limit: 1000 });
      setTransactions(response.transactions);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load transactions';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const newTransaction = await transactionService.createTransaction(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      setError(null);
      const updatedTransaction = await transactionService.updateTransaction(id, updates);
      setTransactions(prev =>
        prev.map(t => (t.id === id ? updatedTransaction : t))
      );
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setError(null);
      await transactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const refreshTransactions = async () => {
    await fetchTransactions();
  };

  return (
    <TransactionContext.Provider
      value={{ 
        transactions, 
        loading, 
        error, 
        addTransaction, 
        updateTransaction, 
        deleteTransaction,
        refreshTransactions 
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
};
