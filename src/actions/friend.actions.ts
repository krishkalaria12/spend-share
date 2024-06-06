import axios from 'axios';
import { Friend } from '@/types';

export const getAllFriends = async (): Promise<Friend[]> => {
    const response = await axios.get('/api/friendship/get-friends');
    return response.data.data;
};

export const searchFriend = async (query: string): Promise<Friend[]> => {
    const response = await axios.get(`/api/friendship/search-friend`, { params: { query } });
    return response.data.data;
};

export const addFriend = async (friendId: string): Promise<Friend> => {
    const response = await axios.post(`/api/friendship/add-friend/${friendId}`);
    return response.data.data;
};

export const removeFriend = async (friendId: string): Promise<void> => {
    await axios.delete(`/api/friendship/remove-friend/${friendId}`);
};
