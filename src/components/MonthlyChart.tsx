import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/ui/card';
import { MonthlyStats } from '@/types/transaction';

interface MonthlyChartProps {
  data: MonthlyStats[];
}

export const MonthlyChart = ({ data }: MonthlyChartProps) => {
  // Memoize the data to prevent unnecessary re-renders
  const chartData = useMemo(() => data, [data]);
  
  // Generate a stable key based on data length and content
  const chartKey = useMemo(() => {
    if (chartData.length === 0) return 'empty';
    return `chart-${chartData.length}-${chartData[0]?.month || 'default'}`;
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
        <p className="text-muted-foreground text-center py-8">
          No data available for chart
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
      <ResponsiveContainer width="100%" height={300} key={chartKey}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="month" 
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend />
          <Bar dataKey="income" fill="hsl(var(--success))" name="Income" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expense" fill="hsl(var(--destructive))" name="Expense" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
