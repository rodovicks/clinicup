'use server';

import axios from 'axios';

const BASE_URL = process.env.BASE_URL || '';

interface ChangePasswordData {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}

interface RequestTokenData {
  email: string;
}

export const changePassword = async (
  data: ChangePasswordData
): Promise<void> => {
  const response = await axios.post(`${BASE_URL}/auth/reset-password`, data);
  return response.data;
};

export const requestPasswordResetToken = async (
  data: RequestTokenData
): Promise<void> => {
  const response = await axios.post(
    `${BASE_URL}/auth/request-password-reset`,
    data
  );
  return response.data;
};
