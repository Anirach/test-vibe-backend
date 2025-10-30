import { useState, useMemo } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { startOfMonth, format, isSameMonth, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/StatsCard';
import { TransactionList } from '@/components/TransactionList';
import { TransactionDialog } from '@/components/TransactionDialog';
import { FilterBar } from '@/components/FilterBar';
import { MonthlyChart } from '@/components/MonthlyChart';
import { ExportButton } from '@/components/ExportButton';
import { TransactionProvider, useTransactions } from '@/contexts/TransactionContext';
import { Transaction, MonthlyStats } from '@/types/transaction';
import { exportToCSV } from '@/lib/transaction-storage';
import { useToast } from '@/hooks/use-toast';

const ExpenseTrackerContent = () => {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const categoryMatch = selectedCategory === 'all' || t.category === selectedCategory;
      const monthMatch = selectedMonth === 'all' || 
        format(t.date, 'MMMM yyyy') === selectedMonth;
      return categoryMatch && monthMatch;
    });
  }, [transactions, selectedCategory, selectedMonth]);

  const availableMonths = useMemo(() => {
    const months = new Set(transactions.map(t => format(t.date, 'MMMM yyyy')));
    return Array.from(months).sort((a, b) => {
      return parseISO(b.split(' ')[1] + '-' + b.split(' ')[0]).getTime() - 
             parseISO(a.split(' ')[1] + '-' + a.split(' ')[0]).getTime();
    });
  }, [transactions]);

  const monthlyStats = useMemo((): MonthlyStats[] => {
    const statsMap = new Map<string, MonthlyStats>();
    
    transactions.forEach(t => {
      const monthKey = format(startOfMonth(t.date), 'MMM yyyy');
      const existing = statsMap.get(monthKey) || {
        month: monthKey,
        income: 0,
        expense: 0,
        balance: 0,
      };
      
      if (t.type === 'income') {
        existing.income += t.amount;
      } else {
        existing.expense += t.amount;
      }
      existing.balance = existing.income - existing.expense;
      
      statsMap.set(monthKey, existing);
    });
    
    return Array.from(statsMap.values())
      .sort((a, b) => {
        const dateA = parseISO(a.month);
        const dateB = parseISO(b.month);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-6);
  }, [transactions]);

  const handleSubmit = async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      setIsSubmitting(true);
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data);
        toast({
          title: 'Transaction updated',
          description: 'Your transaction has been updated successfully.',
        });
      } else {
        await addTransaction(data);
        toast({
          title: 'Transaction added',
          description: 'Your transaction has been added successfully.',
        });
      }
      setEditingTransaction(undefined);
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save transaction',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast({
        title: 'Transaction deleted',
        description: 'Your transaction has been deleted.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete transaction',
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    exportToCSV(filteredTransactions);
    toast({
      title: 'Export successful',
      description: 'Your transactions have been exported to CSV.',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Expense Tracker
          </h1>
          <p className="text-muted-foreground">Track your income and expenses with ease</p>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatsCard
            title="Total Balance"
            amount={stats.balance}
            icon={Wallet}
            variant="balance"
          />
          <StatsCard
            title="Total Income"
            amount={stats.income}
            icon={TrendingUp}
            variant="income"
          />
          <StatsCard
            title="Total Expenses"
            amount={stats.expense}
            icon={TrendingDown}
            variant="expense"
          />
        </div>

        <div className="mb-6">
          <MonthlyChart data={monthlyStats} />
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-2xl font-semibold">Transactions</h2>
            <div className="flex gap-2">
              <ExportButton />
              <Button onClick={() => {
                setEditingTransaction(undefined);
                setDialogOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </div>
          </div>

          <FilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            onExport={handleExport}
            months={availableMonths}
          />

          <TransactionList
            transactions={filteredTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <TransactionDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            if (!isSubmitting) {
              setDialogOpen(open);
              if (!open) setEditingTransaction(undefined);
            }
          }}
          onSubmit={handleSubmit}
          transaction={editingTransaction}
        />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <TransactionProvider>
      <ExpenseTrackerContent />
    </TransactionProvider>
  );
};

export default Index;
