"use client";

import React, { useState, useEffect } from 'react';
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
  Select as SingleSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormError } from '@/components/form-error';
import { Loader2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { requestMoneyFromGroup, getGroupMembers } from '@/actions/group.actions';
import { useToast } from '@/components/ui/use-toast';
import { useMediaQuery } from '@mantine/hooks';
import MultiSelect, { MultiValue } from "react-select";
import { useAuth } from '@clerk/nextjs';

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  amount: z.string().regex(/^\d+$/, { message: "Amount must be a number." }),
  description: z.string().min(1, { message: "Description is required." }),
  category: z.string().min(1, { message: "Category is required." }),
  selectedMembers: z.array(z.object({
    value: z.string(),
    label: z.string()
  })).min(1, { message: "At least one member must be selected." }),
});

type FormData = z.infer<typeof formSchema>;

interface RequestMoneyFromGroupProps {
  error: string;
  groupId: string;
}

const RequestMoneyFromGroup: React.FC<RequestMoneyFromGroupProps> = ({ error, groupId }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const { userId } = useAuth();

  const { data: membersData, isLoading: loadingMembers } = useQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: () => getGroupMembers(groupId),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "0",
      description: "",
      category: "",
      selectedMembers: [],
    },
  });

  const requestMoneyMutation = useMutation({
    mutationFn: (formData: any) => requestMoneyFromGroup(groupId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupTransactions", groupId] });
      toast({
        title: "Request sent successfully",
        description: "Money requested successfully",
        variant: "success",
        duration: 5000,
      });
      setOpen(false); 
      form.reset();
    },
    onError: (error: any) => {
      console.log(error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Please Try Again Later!!",
        variant: "destructive",
        duration: 5000,
      });
      setOpen(false); 
      form.reset();
    }
  });

  const onSubmit = (data: FormData) => {
    const formData = {
      title: data.title,
      amount: parseInt(data.amount, 10),
      description: data.description,
      category: data.category,
      selectedMembers: data.selectedMembers.map(member => member.value),
    };
    requestMoneyMutation.mutate(formData);
  };

  const handleSelectChange = (selectedOptions: MultiValue<{ value: string; label: string }>) => {
    if (selectedOptions.some(option => option.value === 'all')) {
      form.setValue("selectedMembers", membersData.members.filter((member: { clerkId: string; }) => member.clerkId !== userId).map((member: { _id: string; fullName: string; username: string; }) => ({
        value: member._id,
        label: `${member.fullName} (${member.username})`
      })));
    } else {
      form.setValue("selectedMembers", selectedOptions.map(option => ({ value: option.value, label: option.label })));
    }
  };

  const options = [
    { value: 'all', label: 'All' },
    ...(membersData?.members?.filter((member: { clerkId: string; }) => member.clerkId !== userId).map((member: { _id: any; fullName: any; username: any; }) => ({
      value: member._id,
      label: `${member.fullName} (${member.username})`
    })) || [])
  ];

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
          name="selectedMembers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Members</FormLabel>
              <FormControl>
                <MultiSelect
                  isMulti
                  className='text-black'
                  options={options}
                  onChange={handleSelectChange}
                  value={field.value}
                />
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
                <Textarea placeholder="Description" {...field} />
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
                <SingleSelect
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
                </SingleSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <FormError message={error} />}
        <Button className='w-full' disabled={requestMoneyMutation.isPending} type="submit">
          {requestMoneyMutation.isPending ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="animate-spin" size={16} />
              <span>Requesting</span>
            </div>
          ) : (
            "Request"
          )}
        </Button>
      </form>
    </Form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>Request</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Money</DialogTitle>
            <DialogDescription>
              Fill out the form to request money from the group. Click save when you&#39;re done.
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
        <Button className='w-full' onClick={() => setOpen(true)}>Request</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Request Money</DrawerTitle>
          <DrawerDescription>
            Fill out the form to request money from the group. Click save when you&#39;re done.
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

export default RequestMoneyFromGroup;
