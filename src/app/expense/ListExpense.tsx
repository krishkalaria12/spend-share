import React, { useState, useEffect } from "react";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteExpense } from '@/actions/expense.actions';
import { ExpenseCategory } from '@/types';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { DeleteAllExpense } from "@/app/expense/DeleteAllExpense";

interface ListExpenseProps {
  expenses: ExpenseCategory[];
}

const ListExpense: React.FC<ListExpenseProps> = ({ expenses }) => {

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('Food');

  const mutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['expenses']});
      queryClient.invalidateQueries({queryKey: ['expense-comparison']});
      toast({
        variant: "success",
        title: "Expense deleted successfully",
        description: "Thank you for your expense!",
      })
    },
    onError: (error: any) => {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: "Please Try Again Later!!",
      });
    }
  });

  const handleDeleteExpense = (expenseId: string) => {
    mutation.mutate(expenseId);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    if (expenses.length > 0) {
      setSelectedCategory(expenses[0].category);
    }
  }, [expenses]);

  const categoryExpenses = expenses?.find(exp => exp.category === selectedCategory)?.expenses || [];
  
  return (
    <div className="overflow-x-auto">
      {categoryExpenses.length==0 ? (
        <p className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">No expenses Found! Add your expense now to get started.</p>
      ) : (
        <Tabs value={selectedCategory}>
          <div className="flex items-center justify-between">
            <TabsList>
              {expenses?.map((category) => (
                <TabsTrigger key={category.category} value={category.category} onClick={() => handleCategoryChange(category.category)}>
                  {category.category}
                </TabsTrigger>
              ))}
            </TabsList>
            <div>
              <DeleteAllExpense />
            </div>
          </div>
          <TabsContent value={selectedCategory}>
            {categoryExpenses.length === 0 ? (
              <div className="text-center py-4">No expenses available for this category.</div>
            ) : (
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>{selectedCategory} Expenses</CardTitle>
                  <CardDescription>Total: ₹{categoryExpenses.reduce((acc, curr) => acc + curr.amount, 0)}</CardDescription>
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
                      {categoryExpenses.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>₹{item.amount}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              disabled={mutation.isPending}
                              onClick={() => handleDeleteExpense(item._id)}
                              variant="destructive"
                            >
                              {mutation.isPending ? (
                                <span className="mr-2">
                                  <Loader2 size={16} className="animate-spin" />
                                </span>
                              ) : (
                                "Delete"
                              )}
                              {mutation.isPending && "Deleting..."}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ListExpense;
