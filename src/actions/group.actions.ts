import axios from 'axios';
import { Group } from '@/types';

export const getAllGroups = async (): Promise<Group[]> => {
  const response = await axios.get('/api/group/get-all-groups');
  return response.data.data;
};

export const createGroupByValues = async (data: FormData): Promise<Group> => {
  const response = await axios.post('/api/group/create-group', data);
  return response.data.data;
};
