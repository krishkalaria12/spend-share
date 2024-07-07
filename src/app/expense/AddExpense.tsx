"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addExpense } from '@/actions/expense.actions';
import { Loader2 } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import { useMediaQuery } from '@mantine/hooks';

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  amount: z.string().regex(/^\d+$/, { message: "Amount must be a number." }),
  description: z.string().min(1, { message: "Description is required." }),
  category: z.string().min(1, { message: "Category is required." }),
});

type FormData = z.infer<typeof formSchema>;

export const AddExpense: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "0",
      description: "",
      category: "",
    },
  });

  const addExpenseMutation = useMutation({
    mutationFn: (formData: any) => addExpense(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-comparison'] });
      queryClient.invalidateQueries({ queryKey: ['expenseData'] });
      toast({
        title: "Expense added successfully",
        description: "You've successfully added an expense",
        variant: "success",
        duration: 5000,
      });
      setOpen(false); // Close the drawer or dialog after submission
    },
    onError: (error: any) => {
      console.log(error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    }
  });

  const onSubmit = (data: FormData) => {
    const formData = {
      title: data.title,
      amount: parseInt(data.amount, 10),
      description: data.description,
      category: data.category,
    };
    addExpenseMutation.mutate(formData);
  };

  const renderForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:p-0 px-4 w-full">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Studies">Studies</SelectItem>
                    <SelectItem value="Outing">Outing</SelectItem>
                    <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-full' disabled={addExpenseMutation.isPending} type="submit">
          {addExpenseMutation.isPending ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="animate-spin" size={16} />
              <span>Adding...</span>
            </div>
          ) : (
            "Add Expense"
          )}
        </Button>
      </form>
    </Form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>Add Expense</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>
              Add your expense here. Click add when you&#39;re done.
            </DialogDescription>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className='w-full' onClick={() => setOpen(true)}>Add Expense</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Expense</DrawerTitle>
          <DrawerDescription>
            Add your expense here. Click add when you&#39;re done.
          </DrawerDescription>
        </DrawerHeader>
        {renderForm()}
        <DrawerFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
