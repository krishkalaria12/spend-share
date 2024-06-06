import React, { FC } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { FriendCard } from '@/app/friend/FriendCard';
import { Friend } from '@/types';

type SearchFriendProps = {
  loading: boolean;
  searchResults: Friend[];
  onSearchQueryChange: (query: string) => void;
  query: string;
  method: (id: string) => void;
  remove: boolean;
};

export const SearchFriend: FC<SearchFriendProps> = ({ loading, searchResults, onSearchQueryChange, query, method, remove }) => {
  const showNoResultsMessage = !loading && searchResults.length === 0 && query.trim() !== '';
  
  return (
    <div className="max-w-3xl w-full mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Join Forces: Manage Money Together with Friends
        </h1>
        <p className="text-gray-500 md:text-xl lg:text-base xl:text-lg dark:text-gray-400">
          Looking to supercharge your financial journey? Team up with friends to take control of your finances like never before. Connect, collaborate, and conquer your financial goals together. Start pooling resources, sharing insights, and supporting each other on the path to financial freedom. Get ready to amplify your financial strength by joining forces with friends today!
        </p>
      </div>
      <form>
        <div className="grid max-w-3xl grid-cols-4 items-start gap-4 mt-8">
          <DebounceInput
            className="col-span-4 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="search here.."
            type="text"
            minLength={1}
            debounceTimeout={500}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
        </div>
      </form>
      {loading && <p>Loading...</p>}
      {showNoResultsMessage && <p>No results found.</p>}
      {searchResults.map((friend) => (
        <FriendCard key={friend._id} friend={friend} method={method} remove={remove} />
      ))}
    </div>
  );
};
