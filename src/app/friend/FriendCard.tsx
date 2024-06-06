import React, { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Friend } from '@/types';
import Image from 'next/image';

type FriendCardProps = {
  friend: Friend;
  method: (id: string) => void;
  remove: boolean;
};

export const FriendCard: FC<FriendCardProps> = ({ friend, method, remove }) => (
  <div className="flex max-w-3xl w-full mx-auto mt-4 bg-slate-100 dark:bg-slate-800 items-center justify-between p-4">
    <div className="flex items-center space-x-4">
      <div>
        <Image
          className="rounded-full w-20 h-20"
          width={60}
          height={60}
          src={friend.avatar}
          alt={friend.username}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-4 items-center">
          <p className="font-semibold">Username: </p>
          <p className="font-sans">{friend.username}</p>
        </div>
        <div className="flex space-x-4 items-center">
          <p className="font-semibold">Email: </p>
          <p className="font-sans">{friend.email}</p>
        </div>
        <div className="flex space-x-4 items-center">
          <p className="font-semibold">Full Name: </p>
          <p className="font-sans">{friend.fullName}</p>
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <Button onClick={() => method(friend._id)} className={`${remove && 'hidden'}`}>
        Add
      </Button>
      <Button onClick={() => method(friend._id)} className={`${!remove && 'hidden'}`}>
        Remove
      </Button>
    </div>
  </div>
);
