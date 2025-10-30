import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  variant: 'income' | 'expense' | 'balance';
}

export const StatsCard = ({ title, amount, icon: Icon, variant }: StatsCardProps) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(amount));

  return (
    <Card className={cn(
      "p-6 transition-all hover:shadow-md",
      variant === 'income' && "border-success/20 bg-gradient-to-br from-success/5 to-transparent",
      variant === 'expense' && "border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent",
      variant === 'balance' && "border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn(
            "text-3xl font-bold",
            variant === 'income' && "text-success",
            variant === 'expense' && "text-destructive",
            variant === 'balance' && amount >= 0 ? "text-success" : "text-destructive"
          )}>
            {variant === 'balance' && amount >= 0 && '+'}
            {formattedAmount}
          </p>
        </div>
        <div className={cn(
          "rounded-full p-3",
          variant === 'income' && "bg-success/10",
          variant === 'expense' && "bg-destructive/10",
          variant === 'balance' && "bg-primary/10"
        )}>
          <Icon className={cn(
            "h-5 w-5",
            variant === 'income' && "text-success",
            variant === 'expense' && "text-destructive",
            variant === 'balance' && "text-primary"
          )} />
        </div>
      </div>
    </Card>
  );
};
