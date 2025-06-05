'use server';

import axios from 'axios';
import { cookies } from 'next/headers';
import type { User } from '@/contexts/users-context';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

interface UserResponse {
  data: User[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

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
