'use server';

import { ExamType } from '@/contexts/exams-context';
import axios from 'axios';
import { getAuthHeaders } from './jwt-service';

const BASE_URL = process.env.BASE_URL || '';

export interface ExamsTypeResponse {
  data: ExamType[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export const getExamTypes = async (
  page: number = 1
): Promise<ExamsTypeResponse> => {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${BASE_URL}/exams-types`, {
    headers,
    params: { page },
  });

  return response.data;
};

export const saveExamType = async (data: ExamType): Promise<ExamType> => {
  const headers = await getAuthHeaders();
  data.defaultDuration = data.defaultDuration.toString();
  const response = await axios.post(`${BASE_URL}/exams-types`, data, {
    headers,
  });
  return response.data;
};

export const updateExamType = async (
  id: string | number,
  data: ExamType
): Promise<ExamType> => {
  const headers = await getAuthHeaders();
  data.defaultDuration = data.defaultDuration.toString();
  const response = await axios.put(`${BASE_URL}/exams-types/${id}`, data, {
    headers,
  });
  return response.data;
};

export const deleteExamType = async (id: string | number): Promise<void> => {
  const headers = await getAuthHeaders();
  await axios.delete(`${BASE_URL}/exams-types/${id}`, { headers });
};
