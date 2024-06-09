import axios from 'axios';
import { Friend, FriendRequest } from '@/types';

export const getAllFriends = async (): Promise<{ friends: Friend[], pendingRequests: FriendRequest[], yourRequests: FriendRequest[] }> => {
    const response = await axios.get('/api/friendship/get-friends');
    return response.data.data;
};

export const searchFriend = async (query: string): Promise<Friend[]> => {
    const response = await axios.get(`/api/friendship/search-friend?q=${query}`);
    return response.data.data;
};

// Send a friend request
export const sendFriendRequest = async (friendId: string): Promise<void> => {
    const response = await axios.post(`/api/friendship/send-request/${friendId}`);
    return response.data.data;
};

// Accept a friend request
export const acceptFriendRequest = async (requestId: string): Promise<void> => {
    const response = await axios.post(`/api/friendship/accept-request/${requestId}`);
    return response.data.data;
};

// Remove a friend or cancel a request
export const removeFriend = async (friendshipId: string): Promise<void> => {
    const response = await axios.delete(`/api/friendship/remove-friend/${friendshipId}`);
    return response.data.data;
};
