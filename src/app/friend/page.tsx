'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addFriend, getAllFriends, removeFriend, searchFriend } from '@/actions/friend.actions';
import { useToast } from '@/components/ui/use-toast';
import { SearchFriend } from '@/app/friend/SearchFriend';
import { ListFriend } from '@/app/friend/ListFriend';
import { Friend } from '@/types';
import { ServerError } from '@/components/server-error';

const FriendPage = () => {
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [query, setQuery] = useState('');

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: friends = [], isLoading, isError } = useQuery<Friend[]>({
    queryKey: ['friends'],
    queryFn: getAllFriends,
  });

  const addFriendMutation = useMutation({
    mutationFn: addFriend,
    onSuccess: (newFriend) => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast({
        title: 'Successfully added friend',
        description: "You've successfully added a new friend",
        variant: 'success',
        duration: 5000,
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'Please Try Again Later!!',
        variant: 'destructive',
        duration: 5000,
      })
    },
  });

  const removeFriendMutation = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast({
        title: 'Successfully removed friend',
        description: "You've successfully removed a friend",
        variant: 'success',
        duration: 5000,
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'Please Try Again Later!!',
        variant: 'destructive',
        duration: 5000,
      })
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

  const handleAddFriend = (id: string) => {
    setSearchResults([]);
    setQuery('');
    addFriendMutation.mutate(id);
  };

  const handleRemoveFriend = (id: string) => {
    setSearchResults([]);
    setQuery('');
    removeFriendMutation.mutate(id);
  };

  if (isError) {
    return (
      <ServerError />
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <SearchFriend
              loading={addFriendMutation.isPending || removeFriendMutation.isPending}
              searchResults={searchResults}
              onSearchQueryChange={handleSearch}
              query={query}
              method={handleAddFriend}
              remove={false}
            />
          </div>
          <ListFriend
            friends={friends}
            method={handleRemoveFriend}
            remove={true}
            isLoading={isLoading}
          />
        </main>
      </div>
    </div>
  );
};

export default FriendPage;
