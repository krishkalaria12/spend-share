'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sendFriendRequest, getAllFriends, acceptFriendRequest, removeFriend, searchFriend } from '@/actions/friend.actions';
import { useToast } from '@/components/ui/use-toast';
import { SearchFriend } from '@/app/friend/SearchFriend';
import { ListFriend } from '@/app/friend/ListFriend';
import { Friend, FriendRequest } from '@/types';
import { ServerError } from '@/components/server-error';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FriendPage = () => {
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [query, setQuery] = useState('');

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: friendsData = { friends: [], pendingRequests: [], yourRequests: [] }, isLoading, isError } = useQuery<{
    friends: Friend[];
    pendingRequests: FriendRequest[];
    yourRequests: FriendRequest[];
  }>({
    queryKey: ['friends'],
    queryFn: getAllFriends,
  });

  const sendFriendRequestMutation = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast({
        title: 'Successfully sent friend request',
        description: "You've successfully sent a friend request",
        variant: 'success',
        duration: 5000,
      });
    },
    onError: () => {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'Please Try Again Later!!',
        variant: 'destructive',
        duration: 5000,
      });
    },
  });

  const acceptFriendRequestMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast({
        title: 'Successfully accepted friend request',
        description: "You've successfully accepted a friend request",
        variant: 'success',
        duration: 5000,
      });
    },
    onError: () => {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'Please Try Again Later!!',
        variant: 'destructive',
        duration: 5000,
      });
    },
  });

  const removeFriendRequestMutation = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast({
        title: 'Successfully removed friend',
        description: "You've successfully removed a friend",
        variant: 'success',
        duration: 5000,
      });
    },
    onError: () => {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'Please Try Again Later!!',
        variant: 'destructive',
        duration: 5000,
      });
    },
  });

  const handleSearch = async (query: string) => {
    if (query.trim() !== '') {
      setQuery(query);
      const results = await searchFriend(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSendFriendRequest = (id: string) => {
    setSearchResults([]);
    setQuery('');
    sendFriendRequestMutation.mutate(id);
  };

  const handleAcceptFriendRequest = (friendshipId: string) => {
    acceptFriendRequestMutation.mutate(friendshipId);
  };

  const handleRemoveFriendRequest = (friendshipId: string) => {
    removeFriendRequestMutation.mutate(friendshipId);
  };

  if (isError) {
    return (
      <ServerError />
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:px-3">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <SearchFriend
              loading={sendFriendRequestMutation.isPending || acceptFriendRequestMutation.isPending}
              searchResults={searchResults}
              onSearchQueryChange={handleSearch}
              query={query}
              method={handleSendFriendRequest}
              remove={false}
            />
          </div>
          <div className="lg:col-span-2">
            <Tabs defaultValue="friends">
              <TabsList>
                <TabsTrigger value="friends">Friends ({friendsData.friends.length})</TabsTrigger>
                <TabsTrigger value="requests">Requests ({friendsData.pendingRequests.length})</TabsTrigger>
                <TabsTrigger value="yourRequests">Your Requests ({friendsData.yourRequests.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="friends">
                <ListFriend
                  friends={friendsData.friends}
                  method={handleRemoveFriendRequest}
                  remove={true}
                  isLoading={isLoading}
                />
              </TabsContent>
              <TabsContent value="requests">
                <ListFriend
                  friends={friendsData.pendingRequests}
                  method={handleAcceptFriendRequest}
                  remove={false}
                  isLoading={isLoading}
                  requestTab={true}
                />
              </TabsContent>
              <TabsContent value="yourRequests">
                <ListFriend
                  friends={friendsData.yourRequests}
                  method={handleRemoveFriendRequest}
                  remove={true}
                  isLoading={isLoading}
                  requestTab={true}
                  yourRequestStatus={true}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FriendPage;
