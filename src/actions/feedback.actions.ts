import axios from 'axios';
import { Feedback } from '@/types';

export const getFeedback = async (): Promise<Feedback[]> => {
  const response = await axios.get('/api/feedback/get-feedback');
  return response.data.data;
};

export const createFeedback = async (message: string): Promise<Feedback> => {
  const response = await axios.post('/api/feedback/create-feedback', { message });
  return response.data.data;
};

export const deleteFeedback = async (feedbackId: string): Promise<void> => {
  await axios.delete(`/api/feedback/delete-feedback/${feedbackId}`);
};

export const likeFeedback = async (feedbackId: string): Promise<void> => {
  await axios.post(`/api/like/${feedbackId}`); 
};
