import React, { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FriendCard } from '@/app/friend/FriendCard';
import { Friend } from '@/types';
import FriendSkeleton from '@/components/Skeletons/FriendSkeleton';

type ListFriendProps = {
    friends: Friend[];
    remove: boolean;
    method: (id: string) => void;
    isLoading: boolean;
};

export const ListFriend: FC<ListFriendProps> = ({ friends, remove, method, isLoading }) => {

  if (isLoading) {
    return (
      <FriendSkeleton />
    )
  }
  
  return (
    <div className="lg:col-span-2">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <CardTitle className="text-center font-bold text-2xl">Friends</CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length > 0
            ? friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} method={method} remove={remove} />
              ))
            : <h3 className="text-center m-2 font-bold">No Friends Created, Add Your Friend Now!!</h3>}
        </CardContent>
      </Card>
    </div>
  );
}
