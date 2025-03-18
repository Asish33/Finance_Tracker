"use client";

import { Transaction } from "@/app/page";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";

interface ExpensesChartProps {
  transactions: Transaction[];
}

export default function ExpensesChart({ transactions }: ExpensesChartProps) {
  // Get the last 6 months
  const today = new Date();
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  
  const monthlyData = eachMonthOfInterval({
    start: sixMonthsAgo,
    end: today,
  }).map((month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthlyTotal = transactions
      .filter(
        (t) => t.date >= monthStart && t.date <= monthEnd
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: format(month, "MMM yyyy"),
      total: monthlyTotal,
    };
  });

  return (
    <div className="w-full h-[300px]">
      {transactions.length === 0 ? (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          No data to display
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Total"]}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}