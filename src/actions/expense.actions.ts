import axios from 'axios';

export const getAllExpensesByCategory = async () => {
  const response = await axios.get('/api/expense/get-expenses-of-user-by-category');
  return response.data.data;
};

export const getExpenseComparison = async () => {
  const response = await axios.get('/api/expense/get-expense-by-comparison');
  return response.data.data;
};

export const addExpense = async (expenseData: any) => {
  const response = await axios.post('/api/expense/add-expense', expenseData);
  return response.data;
};

export const deleteExpense = async (expenseId: string) => {
  const response = await axios.delete(`/api/expense/delete-expense/${expenseId}`);
  return response.data;
};

export const deleteAllExpense = async () => {
  const response = await axios.delete(`/api/expense/remove-all-expense`);
  return response.data;
};
