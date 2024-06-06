"use client"

import { useQuery } from '@tanstack/react-query';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {AddExpense} from "@/app/expense/AddExpense";
import { getAllExpensesByCategory, getExpenseComparison } from "@/actions/expense.actions";
import ListExpense from "@/app/expense/ListExpense";
import ExpenseComparison from "@/app/expense/ExpenseComparison";
import { ServerError } from '@/components/server-error';
import { ExpenseSkeleton } from '@/components/Skeletons/ExpenseSkeleton';

export default function Expense() {
  const { data: expenses, isLoading: loadingExpenses, isError: errorExpenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: getAllExpensesByCategory,
  });
  const { data: expenseComparison, isLoading: loadingComparison, isError: errorExpenseComparison } = useQuery({
    queryKey: ['expense-comparison'],
    queryFn: getExpenseComparison,
  });

  if (loadingExpenses || loadingComparison) {
    return <ExpenseSkeleton />;
  }

  if (errorExpenses || errorExpenseComparison) {
    return <ServerError />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-4">
        <main className="p-4 w-full">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
            <div className="flex flex-col sm:grid gap-4 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="sm:col-span-1" x-chunk="dashboard-05-chunk-0">
                <CardHeader className="pb-3">
                  <CardTitle>Add Expense</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Introducing Our Dynamic Adding of Expenses for Seamless
                    Management and Insightful Analysis on Money Management.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <AddExpense />
                </CardFooter>
              </Card>
              {expenseComparison && <ExpenseComparison data={expenseComparison} />}
            </div>
            {expenses && expenses.length > 0 && <ListExpense expenses={expenses} />}
            {expenses.length==0 && <p className="text-center text-3xl font-bold tracking-tighter sm:text-3xl md:text-4xl">No expenses Found! Add your expense now to get started.</p>}
          </div>
        </main>
      </div>
    </div>
  );
}
