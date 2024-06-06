import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const ExpenseSkeleton = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-4">
        <main className="p-4 w-full">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
            <div className="flex flex-col sm:grid gap-4 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <ExpenseComparisonSkeleton />
              <ExpenseComparisonSkeleton />
              <ExpenseComparisonSkeleton />
              <ExpenseComparisonSkeleton />
            </div>
            <ListExpenseSkeleton />
          </div>
        </main>
      </div>
    </div>
  );
};

function ExpenseComparisonSkeleton() {
    return (
        <Card x-chunk="dashboard-05-chunk-1">
          <CardHeader className="pb-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-6 w-20" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-6 w-16" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-6 w-24" />
        </CardFooter>
      </Card>
    )
}


function ListExpenseSkeleton() {
  return (
    <Tabs>
      <div className="flex items-center justify-between">
        <TabsList className="space-x-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </TabsList>
        <div>
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
      <div>
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>
              <Skeleton className="h-5 w-16" />
            </CardTitle>
            <Skeleton className="h-5 w-16" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-6 w-8" />
                  </TableCell>
                  <TableCell className="flex space-x-4">
                    <Skeleton className="h-6 w-8" />
                  </TableCell>
                  <TableCell
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Skeleton className="h-6 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-6 w-8" />
                  </TableCell>
                  <TableCell className="flex space-x-4">
                    <Skeleton className="h-6 w-8" />
                  </TableCell>
                  <TableCell
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Skeleton className="h-6 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-6 w-8" />
                  </TableCell>
                  <TableCell className="flex space-x-4">
                    <Skeleton className="h-6 w-8" />
                  </TableCell>
                  <TableCell
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Skeleton className="h-6 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-6 w-8" />
                  </TableCell>
                  <TableCell className="flex space-x-4">
                    <Skeleton className="h-6 w-8" />
                  </TableCell>
                  <TableCell
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Skeleton className="h-6 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Tabs>
  );
}
