"use client";

import { Transaction } from "@/app/page";
import { AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { startOfMonth, endOfMonth } from "date-fns";

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Record<string, number>;
}
type InsightProps = {
  type: string;
  icon: JSX.Element;
  message: string;
};
export default function SpendingInsights({
  transactions,
  budgets,
}: SpendingInsightsProps) {
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const monthlySpending = transactions
    .filter((t) => t.date >= monthStart && t.date <= monthEnd)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const insights:InsightProps[] = [];

  Object.entries(budgets).forEach(([category, budget]) => {
    const spent = monthlySpending[category] || 0;
    const percentage = (spent / budget) * 100;

    if (percentage >= 100) {
      insights.push({
        type: "warning",
        icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
        message: `${category} budget exceeded by ${(percentage - 100).toFixed(0)}%`,
      });
    } else if (percentage >= 80) {
      insights.push({
        type: "caution",
        icon: <TrendingUp className="h-5 w-5 text-orange-500" />,
        message: `${category} budget at ${percentage.toFixed(0)}%`,
      });
    } else if (budget > 0 && spent > 0) {
      insights.push({
        type: "good",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        message: `${category} spending on track (${percentage.toFixed(0)}% of budget)`,
      });
    }
  });

  Object.keys(monthlySpending).forEach((category) => {
    if (!budgets[category]) {
      insights.push({
        type: "suggestion",
        icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
        message: `Consider setting a budget for ${category}`,
      });
    }
  });

  return (
    <div className="space-y-4">
      {insights.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No insights available yet. Start by setting some budgets!
        </div>
      ) : (
        insights.map((insight, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg bg-background border"
          >
            {insight.icon}
            <span>{insight.message}</span>
          </div>
        ))
      )}
    </div>
  );
}