"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOwesToUsers, getMoneyFromUser, payFriend, deleteOwe } from '@/actions/owe.actions';
import { Owe } from '@/types';
import { ServerError } from '@/components/server-error';
import { OweList } from '@/app/ask-friend-for-money/OweList';
import { MoneyOwedList } from '@/app/ask-friend-for-money/MoneyOwedList';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'next-view-transitions';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';

const AskFriendPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [payingOweId, setPayingOweId] = useState<string | null>(null);
  const [deletingOweId, setDeletingOweId] = useState<string | null>(null);

  const { data: owes, isLoading, isError } = useQuery<Owe[]>({
    queryKey: ["owes"],
    queryFn: getOwesToUsers,
  });

  const { data: moneyOwed, isLoading: isLoadingMoneyOwed, isError: isErrorMoneyOwed } = useQuery<Owe[]>({
    queryKey: ["moneyOwed"],
    queryFn: getMoneyFromUser,
  });

  const payOweMutation = useMutation({
    mutationFn: payFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owes"] });
      queryClient.invalidateQueries({ queryKey: ["moneyOwed"] });
      toast({
        title: "Successfully paid friend",
        description: "Money paid successfully",
        variant: "success",
        duration: 5000,
      });
      setPayingOweId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Please Try Again Later!!",
        variant: "destructive",
        duration: 5000,
      });
      setPayingOweId(null);
    }
  });

  const deleteOweMutation = useMutation({
    mutationFn: deleteOwe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owes"] });
      queryClient.invalidateQueries({ queryKey: ["moneyOwed"] });
      toast({
        title: "Successfully deleted owe",
        description: "You've successfully deleted this owe",
        variant: "success",
        duration: 5000,
      });
      setDeletingOweId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Please Try Again Later!!",
        variant: "destructive",
        duration: 5000,
      });
      setDeletingOweId(null);
    }
  });

  if (isLoading || isLoadingMoneyOwed) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    )
  }

  if (isError || isErrorMoneyOwed) {
    return <ServerError />;
  }

  const pendingOwes = owes && owes?.length > 0 && owes.filter((owe) => !owe.paid) || [];
  const confirmedOwes = owes && owes?.length > 0 && owes.filter((owe) => owe.paid) || [];
  
  const pendingMoneyOwed = moneyOwed && moneyOwed?.length > 0 && moneyOwed.filter((owe) => !owe.paid) || [];
  const confirmedMoneyOwed = moneyOwed && moneyOwed?.length > 0 && moneyOwed.filter((owe) => owe.paid) || [];

  const handlePayOwe = (oweId: string) => {
    setPayingOweId(oweId);
    payOweMutation.mutate(oweId);
  };

  const handleDeleteOwe = (oweId: string) => {
    setDeletingOweId(oweId);
    deleteOweMutation.mutate(oweId);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wide sm:text-3xl md:text-4xl">
            Your Money Management with your Friends
          </h1>
          <Link href={"/ask-friend-for-money/ask"}>
            <Button>
              Ask Money from Friend
            </Button>
          </Link>
        </div>
        <div className="flex md:flex-row flex-col gap-4 p-4 w-full mt-4">
          <div className="md:w-1/2 w-full">
            <h3 className='text-3xl font-semibold'>List of transactions you need to pay</h3>
            <p className='text-sm my-3 text-gray-400 font-normal font-mono'>
              You are indebted to the user and must settle your debt by making a payment to them.
            </p>
            <Tabs defaultValue="pendingOwes" className="">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pendingOwes">Pending</TabsTrigger>
                <TabsTrigger value="confirmedOwes">I Paid</TabsTrigger>
              </TabsList>
              <TabsContent value="pendingOwes">
                <OweList owes={pendingOwes} payOwe={handlePayOwe} isPayOweLoading={payOweMutation.isPending} payingOweId={payingOweId} />
              </TabsContent>
              <TabsContent value="confirmedOwes">
                <OweList owes={confirmedOwes} payOwe={handlePayOwe} isPayOweLoading={payOweMutation.isPending} payingOweId={payingOweId} />
              </TabsContent>
            </Tabs>
          </div>
          <div className="md:w-1/2 w-full">
            <h3 className='text-3xl font-semibold'>List of owes remaining</h3>
            <p className='text-sm text-gray-400 font-normal font-mono my-3'>
              The user is indebted to you and needs to fulfill their obligation by making a payment.
            </p>
            <Tabs defaultValue="pendingMoneyOwed" className="w-[90%]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pendingMoneyOwed">Still to be Paid</TabsTrigger>
                <TabsTrigger value="confirmedMoneyOwed">Paid Ones</TabsTrigger>
              </TabsList>
              <TabsContent value="pendingMoneyOwed">
                <MoneyOwedList moneyOwed={pendingMoneyOwed} deleteOwe={handleDeleteOwe} isDeleteOweLoading={deleteOweMutation.isPending} deletingOweId={deletingOweId} />
              </TabsContent>
              <TabsContent value="confirmedMoneyOwed">
                <MoneyOwedList moneyOwed={confirmedMoneyOwed} deleteOwe={handleDeleteOwe} isDeleteOweLoading={deleteOweMutation.isPending} deletingOweId={deletingOweId} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AskFriendPage;
