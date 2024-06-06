import { useState } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addExpense } from '@/actions/expense.actions';
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ExpenseFormData {
  category: string;
  title: string;
  description: string;
  amount: string;
}

export function AddExpense() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState<ExpenseFormData>({
    category: "Food",
    title: "",
    description: "",
    amount: "",
  });

  const mutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['expenses']});
      queryClient.invalidateQueries({queryKey: ['expense-comparison']});
      setFormData({ category: "Food", title: "", description: "", amount: "" });
      toast({
        variant: "success",
        title: "Expense added successfully",
      });
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

  const handleInputChange = (field: keyof ExpenseFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleCategoryChange = (selectedCategory: string) => {
    setFormData({
      ...formData,
      category: selectedCategory,
    });
  };

  const handleAddExpense = async () => {
    // Convert amount to integer before sending form data
    const expenseData = {
      ...formData,
      amount: parseInt(formData.amount)
    };

    mutation.mutate(expenseData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Add Expense to here. Click add when you&#39;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 justify-start items-center">
            <Label htmlFor="title" className="text-left">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              className="col-span-3"
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>
          <div className="flex items-center justify-start gap-4">
            <Label htmlFor="category" className="text-right col-span-1">
              Category
            </Label>
            <Select onValueChange={handleCategoryChange} defaultValue={formData.category}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category to add in" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Studies">Studies</SelectItem>
                <SelectItem value="Outing">Outing</SelectItem>
                <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-left">
              Description
            </Label>
            <Input
              type="text"
              id="description"
              value={formData.description}
              className="col-span-3"
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-left">
              Amount
            </Label>
            <Input
              type="number"
              id="amount"
              value={formData.amount}
              className="col-span-3"
              onChange={(e) => handleInputChange("amount", e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddExpense} type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mutation.isPending ? "Adding..." : "Add Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
