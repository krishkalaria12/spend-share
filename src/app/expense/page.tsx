'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllExpensesByCategory, getExpenseComparison } from '@/actions/expense.actions';
import { ListExpense } from '@/app/expense/ListExpense';
import { AddExpense } from "@/app/expense/AddExpense";
import ExpenseComparison from "@/app/expense/ExpenseComparison";
import { ServerError } from '@/components/server-error';
import { ExpenseSkeleton } from '@/components/Skeletons/ExpenseSkeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

export default function Expense() {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const queryClient = useQueryClient();

  const { data: expensesData, isLoading: loadingExpenses, isError: errorExpenses, isFetching: fetchingExpenses } = useQuery({
    queryKey: ['expenses', page],
    queryFn: () => getAllExpensesByCategory(page, limit),
    placeholderData: (previousData) => previousData,
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

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (expensesData?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-4">
        <main className="p-4 w-full">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
            <div className="flex flex-col sm:grid gap-4 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="sm:col-span-1">
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
            {expensesData && expensesData.expenses.length > 0 ? (
              <ListExpense expenses={expensesData.expenses} />
            ) : (
              <p className="text-center text-3xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                No expenses Found! Add your expense now to get started.
              </p>
            )}
            {expensesData && expensesData.expenses.length > 0 && expensesData?.totalPages && expensesData?.totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem className='cursor-pointer'>
                    <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
                  </PaginationItem>
                  {Array.from({ length: expensesData.totalPages }, (_, index) => (
                    <PaginationItem className='cursor-pointer' key={index}>
                      <PaginationLink
                        isActive={page === index + 1}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem className='cursor-pointer'>
                    <PaginationNext onClick={() => handlePageChange(page + 1)} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
            {fetchingExpenses && <span>Loading...</span>}
          </div>
        </main>
      </div>
    </div>
  );
}
