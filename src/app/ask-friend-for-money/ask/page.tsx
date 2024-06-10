"use client"

import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { askMoneyFromFriend } from '@/actions/owe.actions';
import { getAllFriends } from '@/actions/friend.actions';
import { Friend, OweCreation } from '@/types';
import { ServerError } from '@/components/server-error';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    category: z.string().min(1, { message: "Category is required." }),
    amount: z.preprocess((val) => parseFloat(val as string), z.number().min(0.01, { message: "Amount must be greater than 0." })),
    title: z.string().min(1, { message: "Title is required." }),
    description: z.string().max(200, { message: "Description can't be longer than 200 characters." }),
    friendId: z.string().min(1, { message: "Friend is required." }),
});

type FormValues = z.infer<typeof formSchema>;

const AskMoneyFromFriend: React.FC = () => {
  const queryClient = useQueryClient();
  const {toast} = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      amount: 0,
      title: "",
      description: "",
      friendId: "",
    },
  });

  const { data: friendsData, isLoading, isError } = useQuery<Friend[], Error>({
    queryKey: ["friends"],
    queryFn: async () => {
      try {
        const response = await getAllFriends();
        return response.friends;
      } catch (error) {
        throw new Error("Failed to fetch friends");
      }
    },
  });

  const askMoneyMutation = useMutation({
    mutationFn: ({ friendId, data }: { friendId: string; data: OweCreation }) => askMoneyFromFriend({ friendId, data }),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["owes"] });
        toast({
          title: "Successfully Requested Money",
          description: "Money requested successfully",
          variant: "success",
          duration: 5000,
        });
        router.push("/ask-friend-for-money");
        form.reset();
      },
      onError: (error: Error) => {
        console.log(error);
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Please Try Again Later!!",
          variant: "destructive",
          duration: 5000,
        });
      }
  })

  const onSubmit = (data: FormValues) => {
    askMoneyMutation.mutate({ friendId: data.friendId, data });
  };

  const friendOptions = friendsData?.map((friend) => ({
    value: friend._id,
    label: friend.username,
  })) || [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <ServerError />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="sm:text-4xl text-2xl font-bold mb-8">Ask Money from a Friend</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="friendId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Friend</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your friend" />
                    </SelectTrigger>
                    <SelectContent>
                      {friendOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="category"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
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
              </FormItem>
            )}
          />
          <FormField
            name="amount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Amount"
                    value={field.value}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
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
          <Button disabled={askMoneyMutation.isPending} type="submit">
            {askMoneyMutation.isPending ? (
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="animate-spin" size={16} />
                <span>Submitting</span>
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AskMoneyFromFriend;
