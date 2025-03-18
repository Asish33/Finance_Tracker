"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import ExpensesChart from "@/components/ExpensesChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import BudgetComparisonChart from "@/components/BudgetComparisonChart";
import SpendingInsights from "@/components/SpendingInsights";
import BudgetForm from "@/components/BudgetForm";
import { PlusCircle, DollarSign, PieChart, Clock, Target } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type Transaction = {
  id: string; 
  amount: number;
  date: Date;
  description: string;
  category:
    | "Housing"
    | "Transportation"
    | "Food"
    | "Utilities"
    | "Insurance"
    | "Healthcare"
    | "Entertainment"
    | "Shopping"
    | "Education"
    | "Other";
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [budgetOpen , setBudgetOpen] = useState(false)
  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setTransactions(
          data.map((t: any) => ({
            ...t,
            id: t._id,
            date: new Date(t.date),
          }))
        );
        setError(null);
      } else {
        setTransactions([]);
        setError("Invalid data format received from server");
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setTransactions([]);
      setError("Failed to fetch transactions");
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await fetch("/api/budgets");
      if (!response.ok) {
        throw new Error("Failed to fetch budgets");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        const budgetMap = data.reduce((acc, budget: any) => {
          acc[budget.category] = budget.amount;
          return acc;
        }, {} as Record<string, number>);
        setBudgets(budgetMap);
      }
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      });
      if (!response.ok) throw new Error("Failed to add transaction");
      fetchTransactions();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const addBudget = async (budget: { category: string; amount: number }) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budget),
      });
      if (!response.ok) throw new Error("Failed to set budget");
      fetchBudgets();
    } catch (error) {
      console.error("Error setting budget:", error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete transaction");
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const editTransaction = async (updatedTransaction: Transaction) => {
    try {
      const response = await fetch(
        `/api/transactions/${updatedTransaction.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTransaction),
        }
      );
      if (!response.ok) throw new Error("Failed to update transaction");
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const categoryTotals = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory =
    Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    "N/A";

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-foreground">
            Personal Finance Tracker
          </h1>
          <div className="flex gap-4">
            <Dialog open={budgetOpen} onOpenChange={setBudgetOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Target className="mr-2 h-4 w-4" />
                  Set Budget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <BudgetForm onSubmit={addBudget} existingBudgets={budgets} />
              </DialogContent>
            </Dialog>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <TransactionForm
                  onSubmit={(data) => {
                    addTransaction(data);
                    setOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <h3 className="text-2xl font-bold">
                  ${totalExpenses.toFixed(2)}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Category</p>
                <h3 className="text-2xl font-bold">{topCategory}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Latest Transaction
                </p>
                <h3 className="text-2xl font-bold">
                  {recentTransactions[0]
                    ? format(recentTransactions[0].date, "MMM d")
                    : "No transactions"}
                </h3>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="charts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="charts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Monthly Expenses
                </h2>
                <ExpensesChart transactions={transactions} />
              </Card>
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Expenses by Category
                </h2>
                <CategoryPieChart transactions={transactions} />
              </Card>
              <Card className="p-6 lg:col-span-2">
                <h2 className="text-2xl font-semibold mb-4">
                  Budget vs. Actual
                </h2>
                <BudgetComparisonChart
                  transactions={transactions}
                  budgets={budgets}
                />
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="insights">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Spending Insights</h2>
              <SpendingInsights transactions={transactions} budgets={budgets} />
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
          <TransactionList
            transactions={transactions}
            onDelete={deleteTransaction}
            onEdit={editTransaction}
          />
        </Card>
      </div>
    </div>
  );
}
