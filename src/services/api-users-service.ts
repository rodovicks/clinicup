'use server';

import axios from 'axios';
import type { User } from '@/contexts/users-context';
import { getAuthHeaders } from './jwt-service';

const BASE_URL = process.env.BASE_URL || '';
const secret = process.env.NEXTAUTH_SECRET;
interface UserResponse {
  data: User[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export const getUsers = async (page: number = 1): Promise<UserResponse> => {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${BASE_URL}/users`, {
    headers,
    params: { page },
  });

  return response.data;
};

export const saveUser = async (data: User): Promise<User> => {
  const headers = await getAuthHeaders();
  const response = await axios.post(`${BASE_URL}/users`, data, {
    headers,
  });

  return response.data;
};

export const updateUser = async (id: string, data: User): Promise<User> => {
  const headers = await getAuthHeaders();
  const response = await axios.put(`${BASE_URL}/users/${id}`, data, {
    headers,
  });

  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  const headers = await getAuthHeaders();
  await axios.delete(`${BASE_URL}/users/${id}`, {
    headers,
  });
};
