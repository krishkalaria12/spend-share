"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { visualizeExpense } from "@/actions/expense.actions";
import { BarChartComponent } from "@/app/expense/visualize/BarChartComponent";
import { LineChartComponent } from "@/app/expense/visualize/LineChartComponent";
import { PieChartComponent } from "@/app/expense/visualize/PieChartComponent";
import { ServerError } from "@/components/server-error";

const Visualize = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['expenseData'],
    queryFn: () => visualizeExpense()
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <ServerError />;
  }

  console.log(data);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
      {/* Pie Chart - Category Breakdown */}
      <PieChartComponent data={data.categoryBreakdown} />

      <BarChartComponent data={data.monthlySpending} />

      {/* Line Chart - Daily Expense */}
      <LineChartComponent data={data.dailyExpense} />

    </div>
  );
};

export default Visualize;
