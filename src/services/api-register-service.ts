import axios from 'axios';

const BASE_URL = process.env.BASE_URL || '';

interface RegisterStatusResponse {
  initialized: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  maxWaitTimeMin: number;
}

export const getSetupStatus = async (): Promise<RegisterStatusResponse> => {
  const headers = { 'Content-Type': 'application/json' };
  const response = await axios.get(`${BASE_URL}/setup/status`, {
    headers,
  });

  return response.data;
};

export const saveSetup = async (data: RegisterData) => {
  console.log(data);
  const headers = { 'Content-Type': 'application/json' };
  const response = await axios.post(`${BASE_URL}/setup`, data, {
    headers,
  });

  return response.data;
};
