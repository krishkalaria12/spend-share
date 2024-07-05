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

export const getGroupById = async (groupId: string) => {
  const response = await axios.get(`/api/group/get-group-by-id/${groupId}`);
  return response.data.data;
};

export const getGroupTransactions = async (groupId: string, page: number = 1, limit: number = 10) => {
  const response = await axios.get(`/api/group/group-transactions/${groupId}?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const leaveGroup = async (groupId: string) => {
  const response = await axios.delete(`/api/group/leave-group/${groupId}`);
  return response.data;
};

export const getGroupMembers = async (groupId: string) => {
  const response = await axios.get(`/api/group/get-group-member/${groupId}`);
  return response.data.data;
};

export const deleteGroupById = async (groupId: string) => {
  const response = await axios.delete(`/api/group/delete-group/${groupId}`);
  return response.data;
};

export const removeMemberFromGroupByAdmin = async (
  groupId: string,
  memberId: string
) => {
  const response = await axios.delete("/api/group/remove-member-by-admin", {
    data: { groupId, memberId },
  });
  return response.data;
};

export const changeGroupAdmin = async (groupId: string, memberId: string) => {
  const response = await axios.patch('/api/group/change-group-admin', { groupId, memberId });
  return response.data;
};

export const requestMoneyFromGroup = async (groupId: string, formData: any) => {
  const response = await axios.post(`/api/group/request-money-from-group/${groupId}`, formData );
  return response.data;
};

export const addMemberToGroup = async (groupId: string, memberIds: string[]) => {
  const response = await axios.post(`/api/group/add-member/${groupId}`, { memberIds });
  return response.data;
};
