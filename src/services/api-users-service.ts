'use server';

import axios from 'axios';
import type { User } from '@/contexts/users-context';
import {
  getAuthHeaders,
  getAuthHeadersWithoutContentType,
} from './jwt-service';

const BASE_URL = process.env.BASE_URL || '';

interface UserResponse {
  data: User[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export const getUser = async (id: string): Promise<User> => {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${BASE_URL}/users/${id}`, { headers });
  return response.data;
};

export const getUsers = async (page: number = 1): Promise<UserResponse> => {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${BASE_URL}/users`, {
    headers,
    params: { page },
  });

  return response.data;
};

export const confirmEmailChange = async (
  id: string,
  code: string
): Promise<void> => {
  const headers = await getAuthHeaders();

  await axios.post(
    `${BASE_URL}/users/${id}/confirm-email-change`,
    { code },
    { headers }
  );
};

export const saveUser = async (data: User | FormData): Promise<User> => {
  const isFormData = data instanceof FormData;

  const headers = isFormData
    ? await getAuthHeadersWithoutContentType()
    : await getAuthHeaders();
  console.log(data);
  const response = await axios.post(`${BASE_URL}/users`, data, { headers });
  return response.data;
};

export const updateUser = async (
  id: string,
  data: User | FormData
): Promise<User> => {
  const isFormData = data instanceof FormData;

  const headers = isFormData
    ? await getAuthHeadersWithoutContentType()
    : await getAuthHeaders();

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

export const updateUserEmail = async (
  id: string,
  email: string
): Promise<User> => {
  const headers = await getAuthHeaders();

  const response = await axios.post(
    `${BASE_URL}/users/${id}/request-password-reset`,
    email,
    { headers }
  );
  return response.data;
};
