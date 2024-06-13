import React from 'react';
import TransactionCard from '@/components/Transactions/TransactionCard';
import RequestMoneyFromGroup from './RequestMoneyFromGroup';
import { Transaction } from '@/types';

interface TransactionListProps {
  transactions: Transaction[];
  error: string;
  groupId: string;
  currentUserId: string | null | undefined;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, error, groupId, currentUserId }) => {

  return (
    <div className="min-h-screen dark:bg-[#020817] bg-gray-100 dark:text-white text-gray-800 py-8 px-4">
      <div className="flex items-center mb-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
        </div>
        <div>
          <RequestMoneyFromGroup groupId={groupId} error={error} />
        </div>
      </div>
      <div className="">
        {transactions && transactions.length > 0 && transactions.map((transaction) => (
          <TransactionCard key={transaction._id} transaction={transaction} currentUserId={currentUserId} />
        ))}
        {transactions && transactions.length === 0 && <p className="text-center text-lg font-normal tracking-wide text-gray-400 sm:text-xl md:text-2xl">No transactions Found! Add your transaction now to get started.</p>}
      </div>
    </div>
  );
};

export default TransactionList;
