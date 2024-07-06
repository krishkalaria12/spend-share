"use client";

import React from "react";
import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Loader2 } from "lucide-react";

type CategoryBreakdownData = {
  _id: string;
  totalAmount: number;
};

type PieChartProps = {
  data: CategoryBreakdownData[];
};

const chartConfig = {
  categoryBreakdown: {
    label: "Category Breakdown",
  },
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

export const PieChartComponent: React.FC<PieChartProps> = ({ data }) => {

  const chartData = data.map((item) => ({
    category: item._id,
    totalAmount: item.totalAmount,
    fill: (chartConfig as any)[item._id]?.color || 'hsl(var(--chart-5))',
  }));

  const totalOverallExpense = data.reduce((total, category) => total + category.totalAmount, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Category Breakdown</CardTitle>
        <CardDescription>Showing expense distribution by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="totalAmount" label nameKey="category" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total overall expense: ₹{totalOverallExpense} across all categories.
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total expenses by category
        </div>
      </CardFooter>
    </Card>
  );
};
