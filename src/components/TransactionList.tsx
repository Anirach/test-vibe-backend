import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList = ({ transactions, onEdit, onDelete }: TransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No transactions yet. Add your first transaction to get started!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => {
        const isIncome = transaction.type === 'income';
        const formattedAmount = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(transaction.amount);

        return (
          <Card
            key={transaction.id}
            className="p-4 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={cn(
                    "text-sm font-medium px-2 py-0.5 rounded-full",
                    isIncome ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  )}>
                    {transaction.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(transaction.date, 'MMM dd, yyyy')}
                  </span>
                </div>
                <p className="font-medium truncate">{transaction.description}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <p className={cn(
                  "text-lg font-bold tabular-nums",
                  isIncome ? "text-success" : "text-destructive"
                )}>
                  {isIncome ? '+' : '-'}{formattedAmount}
                </p>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(transaction)}
                    aria-label={`Edit ${transaction.description}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(transaction.id)}
                    aria-label={`Delete ${transaction.description}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
