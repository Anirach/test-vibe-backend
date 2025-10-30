import { Transaction } from '@/types/transaction';

const STORAGE_KEY = 'expense-tracker-transactions';

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions:', error);
  }
};

export const loadTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return parsed.map((t: any) => {
      // Handle category migration: if it's an object, extract the name
      let category = t.category;
      if (typeof category === 'object' && category !== null) {
        category = category.name || 'Other';
      }
      
      return {
        ...t,
        category,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
      };
    });
  } catch (error) {
    console.error('Failed to load transactions:', error);
    return [];
  }
};

export const exportToCSV = (transactions: Transaction[]): void => {
  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
  const rows = transactions.map(t => [
    t.date.toLocaleDateString(),
    t.type,
    t.category,
    t.description,
    t.amount.toFixed(2),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
