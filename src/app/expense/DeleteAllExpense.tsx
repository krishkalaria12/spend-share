"use client";

import { useState } from "react";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { deleteAllExpense } from '@/actions/expense.actions';
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMediaQuery } from "@mantine/hooks";
import { cn } from "@/lib/utils"; // Ensure this utility is available

export function DeleteAllExpense() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: deleteAllExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-comparison'] });
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

  const handleDeleteAllExpenses = async () => {
    mutation.mutate();
  };

  const DeleteConfirmationContent = ({ isDrawer = false, className }: { isDrawer?: boolean, className?: string }) => (
    <div className={cn("grid gap-4 py-4", className)}>
      <DialogFooter>
          {!isDrawer && <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>}
          <Button variant={"destructive"} onClick={handleDeleteAllExpenses} type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mutation.isPending ? "Deleting..." : "Delete All Expenses"}
          </Button>
        {isDrawer && (
          <DrawerClose asChild>
            <Button className="mb-2" variant="outline">Cancel</Button>
          </DrawerClose>
        )}
      </DialogFooter>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Delete all expenses</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete all expenses</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete all expenses? This action cannot be undone.
          </DialogDescription>
          <DeleteConfirmationContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Delete all expenses</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Delete all expenses</DrawerTitle>
          <DrawerDescription>
            Are you sure you want to delete all expenses? This action cannot be undone.
          </DrawerDescription>
        </DrawerHeader>
        <DeleteConfirmationContent isDrawer className="px-4" />
      </DrawerContent>
    </Drawer>
  );
}
