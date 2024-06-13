import axios from 'axios';
import { Feedback } from '@/types';

// Fetch feedback with pagination support
export const getFeedback = async (page: number, limit: number): Promise<{
  feedbacks: Feedback[],
  totalPages: number,
  currentPage: number,
}> => {
  const response = await axios.get(`/api/feedback/get-feedback?page=${page}&limit=${limit}`);
  return response.data.data;
};

// Create a new feedback
export const createFeedback = async (message: string): Promise<Feedback> => {
  const response = await axios.post('/api/feedback/create-feedback', { message });
  return response.data.data;
};

// Delete feedback by ID
export const deleteFeedback = async (feedbackId: string): Promise<void> => {
  await axios.delete(`/api/feedback/delete-feedback/${feedbackId}`);
};

// Like feedback by ID
export const likeFeedback = async (feedbackId: string): Promise<void> => {
  await axios.post(`/api/feedback/like-feedback/${feedbackId}`);
};
