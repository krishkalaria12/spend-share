// src/components/group/TransactionCard.tsx
import React from "react";
import { formatDate } from "@/utils/formatDate";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Transaction } from "@/types";

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  
  return (
    <div className={`flex justify-between items-center p-4 border rounded-lg dark:border-gray-600 border-gray-200 dark:bg-gray-800 bg-white dark:text-white text-gray-800 mb-4 shadow-lg`}>
      <div className="space-x-2 items-center flex">
        <div>
          <Avatar className="hidden h-16 w-16 sm:flex">
            <AvatarImage src={transaction.creditor.avatar} alt="Avatar" />
            <AvatarFallback>{transaction.creditor.username.replace(/\s/g, '').substring(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="flex space-x-2 items-center">
            <p className="font-semibold text-xl font-Roboto">{transaction.creditor.username.charAt(0).toUpperCase() + transaction.creditor.username.slice(1)}</p>
            <p>{formatDate(transaction.createdAt)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={"bg-[#d17dff] text-base cursor-pointer hover:bg-[#b654ec]"}>
              {transaction.title}
            </Badge>
            <Badge className={"cursor-pointer text-balance"}>
              {transaction.category}
            </Badge>
          </div>
        </div>
        <div>
          <p className="text-xl font-semibold font-Roboto">₹{transaction.amount.toFixed(2)}</p>
        </div>
      </div>
      <div>
        <Button disabled={transaction.paid}>
          {transaction.paid ? "Paid" : "Pay"}
        </Button>
      </div>
    </div>
  );
};

export default TransactionCard;
