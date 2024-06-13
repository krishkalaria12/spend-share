import React, { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FriendCard } from '@/app/friend/FriendCard';
import { Friend, FriendRequest } from '@/types';
import FriendSkeleton from '@/components/Skeletons/FriendSkeleton';

type ListFriendProps = {
  friends: Friend[] | FriendRequest[];
  remove: boolean;
  method: (id: string) => void;
  isLoading: boolean;
  requestTab?: boolean;
  yourRequestStatus?: boolean;
};

export const ListFriend: FC<ListFriendProps> = ({ friends, remove, method, isLoading, requestTab, yourRequestStatus = false }) => {
  if (isLoading) {
    return <FriendSkeleton />;
  }
  
  return (
    <div className="lg:col-span-2 h-96 overflow-y-auto">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <CardTitle className="text-center font-bold text-2xl">{requestTab ? 'Requests' : 'Friends'}</CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length > 0 ? (
            friends.map((friend: any) => (
              <FriendCard
                key={friend._id}
                friend={requestTab ? { ...friend.user, friendshipId: friend._id } : { ...friend, friendshipId: friend.friendshipId }}
                method={method}
                remove={remove}
                yourRequestStatus={yourRequestStatus}
              />
            ))
          ) : (
            <h3 className="text-center m-2 font-bold">
              {requestTab ? 'No Friend Requests' : 'No Friends Created, Add Your Friend Now!!'}
            </h3>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
