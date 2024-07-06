"use client";

import React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

type DailyExpenseData = {
  day: number;
  month: number;
  year: number;
  totalAmount: number;
};

type LineChartProps = {
  data: DailyExpenseData[];
};

const chartConfig = {
  totalAmount: {
    label: "Daily Expense",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const LineChartComponent: React.FC<LineChartProps> = ({ data }) => {
  // Ensure data is sorted by date
  const sortedData = data.sort((a, b) => new Date(a.year, a.month - 1, a.day).getTime() - new Date(b.year, b.month - 1, b.day).getTime());

  // Create chart data with connection to zero before first data point
  const chartData = sortedData.map((item, index) => ({
    date: `${item.day}/${item.month}/${item.year}`,
    totalAmount: item.totalAmount,
  }));

  // Adding a zero-point at the beginning of the chart data
  if (chartData.length > 0) {
    chartData.unshift({ date: "0", totalAmount: 0 });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Daily Expense</CardTitle>
        <CardDescription>Showing daily expenses over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="totalAmount"
                type="monotone"
                stroke={chartConfig.totalAmount.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Your Expense Visualized for every day
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Expense for every day
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
