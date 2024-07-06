"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

type MonthlySpendingData = {
  month: number;
  year: number;
  category: string;
  totalAmount: number;
};

type BarChartProps = {
  data: MonthlySpendingData[];
};

const chartConfig = {
  Food: {
    label: "Food",
    color: "hsl(var(--chart-1))",
  },
  Studies: {
    label: "Studies",
    color: "hsl(var(--chart-2))",
  },
  Outing: {
    label: "Outing",
    color: "hsl(var(--chart-3))",
  },
  Miscellaneous: {
    label: "Miscellaneous",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export const BarChartComponent: React.FC<BarChartProps> = ({ data }) => {
  const chartData = Array.from(new Set(data.map(item => `${item.month}/${item.year}`))).map(date => {
    const [month, year] = date.split('/');
    return {
      date: `${month}/${year}`,
      Food: data.find(item => item.month === parseInt(month) && item.year === parseInt(year) && item.category === 'Food')?.totalAmount || 0,
      Studies: data.find(item => item.month === parseInt(month) && item.year === parseInt(year) && item.category === 'Studies')?.totalAmount || 0,
      Outing: data.find(item => item.month === parseInt(month) && item.year === parseInt(year) && item.category === 'Outing')?.totalAmount || 0,
      Miscellaneous: data.find(item => item.month === parseInt(month) && item.year === parseInt(year) && item.category === 'Miscellaneous')?.totalAmount || 0
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Monthly Spending</CardTitle>
        <CardDescription>Showing monthly spending by category for the past 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} width={600} height={400}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Bar dataKey="Food" stackId="a" fill={chartConfig.Food.color} radius={[0, 0, 4, 4]} />
            <Bar dataKey="Studies" stackId="a" fill={chartConfig.Studies.color} radius={[0, 0, 4, 4]} />
            <Bar dataKey="Outing" stackId="a" fill={chartConfig.Outing.color} radius={[0, 0, 4, 4]} />
            <Bar dataKey="Miscellaneous" stackId="a" fill={chartConfig.Miscellaneous.color} radius={[0, 0, 4, 4]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Your Expense Visualized for every month
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total expenses by category for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};
