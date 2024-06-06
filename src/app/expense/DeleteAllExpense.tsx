"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteAllExpense } from '@/actions/expense.actions';
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function DeleteAllExpense() {

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: deleteAllExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['expenses']});
      queryClient.invalidateQueries({queryKey: ['expense-comparison']});
      toast({
        variant: "success",
        title: "All Expenses Deleted Successfully",
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

  const handleAddExpense = async () => {
    mutation.mutate();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Delete all expenses</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete all expenses</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete all expenses? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleAddExpense} type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mutation.isPending ? "Deleting..." : "Delete All Expenses"}
        </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
