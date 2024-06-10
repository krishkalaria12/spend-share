import React from 'react';
import { Owe } from '@/types';
import { ListingMoneyOwedCard } from '@/app/ask-friend-for-money/ListingMoneyOwedCard';

interface MoneyOwedListProps {
  moneyOwed: Owe[];
  deleteOwe: (oweId: string) => void;
  isDeleteOweLoading: boolean;
}

export const MoneyOwedList: React.FC<MoneyOwedListProps> = ({ moneyOwed, deleteOwe, isDeleteOweLoading }) => {
  return (
    <div className="w-full">
      {moneyOwed.map((owe) => (
        <ListingMoneyOwedCard key={owe._id} owe={owe} deleteOwe={deleteOwe} isLoading={isDeleteOweLoading} />
      ))}
      {moneyOwed.length === 0 && (
        <p className='text-center text-2xl mt-3 font-bold tracking-wide sm:text-3xl md:text-3xl'>
          No transactions found
        </p>
      )}
    </div>
  );
};
