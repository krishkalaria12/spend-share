"use client"

import React, { useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Transaction } from "@/types";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "../ui/drawer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { payFriend } from "@/actions/owe.actions";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface TransactionCardProps {
  transaction: Transaction;
  currentUserId: string | null | undefined;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, currentUserId }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<{ title: string; members: { fullName: string; avatar: string }[] }>({
    title: "",
    members: [],
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDrawer = (title: string, members: { fullName: string; avatar: string }[]) => {
    setDrawerContent({ title, members });
    setIsDrawerOpen(true);
  };

  const paidMembers = transaction.owes.filter((owe: { paid: any; }) => owe.paid).map((owe: { debtor: any; }) => owe.debtor);
  const unpaidMembers = transaction.owes.filter((owe: { paid: any; }) => !owe.paid).map((owe: { debtor: any; }) => owe.debtor);
  const currentUserOwe = transaction.owes.find((owe: { debtor: { clerkId: string | null | undefined; }; }) => owe.debtor.clerkId === currentUserId);

  const payFriendMutation = useMutation({
    mutationFn: (oweId: string) => payFriend(oweId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupTransactions"] });
      toast({
        title: "Payment Successful",
        description: "You have successfully paid your share.",
        variant: "success",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  });

  const handlePay = () => {
    if (currentUserOwe) {
      payFriendMutation.mutate(currentUserOwe._id);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between p-4 border rounded-lg dark:border-gray-600 border-gray-200 dark:bg-gray-800 bg-white dark:text-white text-gray-800 mb-4 shadow-lg">
        <div className="flex items-center flex-col justify-between sm:space-y-2 space-x-2 sm:space-x-0">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <Avatar className="h-16 w-16">
              <AvatarImage src={transaction.creditor.avatar} alt="Avatar" />
              <AvatarFallback>{transaction.creditor.username.replace(/\s/g, '').substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-xl">{transaction.creditor.username.charAt(0).toUpperCase() + transaction.creditor.username.slice(1)}</p>
              <p className="text-sm text-gray-400">{formatDate(transaction.createdAt)}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className="bg-purple-600 text-white text-base cursor-pointer hover:bg-purple-500">
                  {transaction.title}
                </Badge>
                <Badge className="bg-gray-300 text-gray-700 cursor-pointer hover:bg-gray-400">
                  {transaction.category}
                </Badge>
              </div>
            </div>
            
          </div>
          <div>
              <Button variant="outline" onClick={() => handleDrawer("Paid Members", paidMembers)}>
                Paid Members
              </Button>
              <Button variant="outline" onClick={() => handleDrawer("Unpaid Members", unpaidMembers)}>
                Unpaid Members
              </Button>
            </div>
        </div>
        <div className="flex sm:flex-col flex-row justify-between items-end space-y-2 sm:space-x-0 space-x-4">
          <div className="text-right">
            <p className="text-lg font-semibold">Total Amount</p>
            <p className="text-xl font-semibold">₹{transaction.totalAmount.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">Amount to be Paid</p>
            <p className="text-xl font-semibold">₹{currentUserOwe ? currentUserOwe.amount.toFixed(2) : "0.00"}</p>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button onClick={handlePay} disabled={currentUserOwe?.paid || payFriendMutation.isPending}>
              {payFriendMutation.isPending ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Loader2 className="animate-spin" size={16} />
                  <span>Paying...</span>
                </div>
              ) : (
                currentUserOwe?.paid ? "Paid" : "Pay"
              )}
            </Button>
          </div>
        </div>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{drawerContent.title}</DrawerTitle>
            <DrawerDescription>List of members</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            {drawerContent.members.map((member, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar} alt={member.fullName} />
                  <AvatarFallback>{member.fullName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <p>{member.fullName}</p>
              </div>
            ))}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default TransactionCard;
