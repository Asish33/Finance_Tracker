"use client";

import { Transaction } from "@/app/page";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { startOfMonth, endOfMonth } from "date-fns";

interface BudgetComparisonChartProps {
  transactions: Transaction[];
  budgets: Record<string, number>;
}

export default function BudgetComparisonChart({
  transactions,
  budgets,
}: BudgetComparisonChartProps) {
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const monthlySpending = transactions
    .filter((t) => t.date >= monthStart && t.date <= monthEnd)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const data = Object.keys(budgets).map((category) => ({
    category,
    budget: budgets[category],
    spent: monthlySpending[category] || 0,
  }));

  return (
    <div className="w-full h-[300px]">
      {data.length === 0 ? (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          No budgets set
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
            />
            <Legend />
            <Bar name="Budget" dataKey="budget" fill="hsl(var(--chart-1))" />
            <Bar name="Spent" dataKey="spent" fill="hsl(var(--chart-2))" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}