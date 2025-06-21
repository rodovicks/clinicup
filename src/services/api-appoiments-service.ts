'use server';

import axios from 'axios';
import { Appointment } from '@/contexts/appoiments-context';
import { getAuthHeaders } from './jwt-service';

const BASE_URL = process.env.BASE_URL || '';

interface AppointmentsResponse {
  data: Appointment[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
export const getAppointments = async (
  page: number = 1
): Promise<AppointmentsResponse> => {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${BASE_URL}/appoiments`, {
    headers,
    params: { page },
  });

  return response.data;
};

export const saveAppointment = async (
  data: Appointment
): Promise<Appointment> => {
  const headers = await getAuthHeaders();
  const response = await axios.post(`${BASE_URL}/appoiments`, data, {
    headers,
  });

  return response.data;
};

export const updateAppointment = async (id: string, data: Appointment) => {
  const headers = await getAuthHeaders();
  const response = await axios.put(`${BASE_URL}/appoiments/${id}`, data, {
    headers,
  });

  return response.data;
};

export const deleteAppointment = async (id: string) => {
  const headers = await getAuthHeaders();
  await axios.delete(`${BASE_URL}/appoiments/${id}`, {
    headers,
  });
};
