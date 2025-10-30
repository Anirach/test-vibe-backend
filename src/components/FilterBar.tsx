import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TransactionCategory } from '@/types/transaction';
import { Download } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onExport: () => void;
  months: string[];
}

const categories: TransactionCategory[] = [
  'Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Healthcare',
  'Salary', 'Freelance', 'Investment', 'Other'
];

export const FilterBar = ({
  selectedCategory,
  onCategoryChange,
  selectedMonth,
  onMonthChange,
  onExport,
  months,
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map(cat => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedMonth} onValueChange={onMonthChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Time" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          {months.map(month => (
            <SelectItem key={month} value={month}>{month}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={onExport}
        className="ml-auto"
      >
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
};
