import React from 'react';
import { Owe } from '@/types';
import { ListingOweCard } from '@/app/ask-friend-for-money/ListingOweCard';

interface OweListProps {
  owes: Owe[];
  payOwe: (oweId: string) => void;
  isPayOweLoading: boolean;
}

export const OweList: React.FC<OweListProps> = ({ owes, payOwe, isPayOweLoading }) => {
  return (
    <div className="w-full">
      {owes.map((owe) => (
        <ListingOweCard key={owe._id} owe={owe} payOwe={payOwe} isLoading={isPayOweLoading} />
      ))}
      {owes.length === 0 && (
        <p className='text-center text-2xl mt-3 font-bold tracking-wide sm:text-3xl md:text-3xl'>
          No transactions found
        </p>
      )}
    </div>
  );
};
