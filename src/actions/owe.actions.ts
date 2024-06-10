import axios from 'axios';
import { Owe, OweCreation } from '@/types';

// Fetch the owes that the authenticated user needs to pay to others
export const getOwesToUsers = async (): Promise<Owe[]> => {
  const response = await axios.get('/api/owe/get-owes-to-users');
  return response.data.data;
};

// Fetch the owes that others need to pay to the authenticated user
export const getMoneyFromUser = async (): Promise<Owe[]> => {
  const response = await axios.get('/api/owe/get-money-from-user');
  return response.data.data;
};

// Ask money from a friend
export const askMoneyFromFriend = async ({ friendId, data }: { friendId: string; data: OweCreation }): Promise<Owe> => {
  const response = await axios.post(`/api/owe/ask-money-from-friend/${friendId}`, data);
  return response.data.data;
};

// Pay a friend
export const payFriend = async (oweId: string): Promise<void> => {
  await axios.post(`/api/owe/pay-friend/${oweId}`);
};

// Delete an owe
export const deleteOwe = async (oweId: string): Promise<void> => {
  await axios.delete(`/api/owe/delete-owe/${oweId}`);
};
