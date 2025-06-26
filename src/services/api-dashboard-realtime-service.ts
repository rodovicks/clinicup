'use server';

import axios from 'axios';
import { getAuthHeaders } from './jwt-service';

const BASE_URL = process.env.BASE_URL || '';

export interface ExamType {
  id: string;
  name: string;
  defaultDuration: string;
}

export interface WaitingPatient {
  id: string;
  patient_name: string;
  estimatedWaitTimeMinutes: number;
  positionInQueue: number;
  examsType: {
    name: string;
  };
}

export interface FinishedAppointment {
  id: string;
  patient_name: string;
  date_start: string;
  finishedDate: string;
  actualDurationMinutes: number;
  examsType: {
    name: string;
  };
}

export interface InProgressAppointment {
  id: string;
  patient_name: string;
  patient_cpf: string;
  date_start: string;
  examsType: {
    id: string;
    name: string;
  };
}

export interface AverageTime {
  examTypeId: string;
  examTypeName: string;
  defaultDuration: string;
  averageTimeMinutes: number;
}

export interface RealTimeDashboardResponse {
  confirmed: {
    id: string;
    patient_name: string;
    patient_cpf: string;
    date_start: string;
    examsType: ExamType;
    estimatedWaitTimeMinutes: number;
    positionInQueue: number;
  }[];
  finished: FinishedAppointment[];
  inProgress: InProgressAppointment[];
  averageTimes: AverageTime[];
  currentDateTime: string;
}

export interface WaitingQueueResponse {
  waitingPatients: WaitingPatient[];
  currentDateTime: string;
  averageTimes: AverageTime[];
}

export interface FinishedAppointmentsResponse {
  finishedAppointments: FinishedAppointment[];
  currentDateTime: string;
}

export const getDashboardRealTime = async (
  examTypeIds?: string[]
): Promise<RealTimeDashboardResponse> => {
  const response = await axios.get(`${BASE_URL}/dashboard/real-time`, {});
  return response.data;
};

export const getWaitingQueue = async (): Promise<WaitingQueueResponse> => {
  const response = await axios.get(`${BASE_URL}/dashboard/waiting-queue`);
  return response.data;
};

export const getFinishedAppointments =
  async (): Promise<FinishedAppointmentsResponse> => {
    const response = await axios.get(
      `${BASE_URL}/dashboard/finished-appointments`
    );
    return response.data;
  };

export const getExamTypesSummary = async () => {
  const response = await axios.get(`${BASE_URL}/dashboard/exam-types-summary`);
  return response.data;
};

export const getTimeInfo = async () => {
  const response = await axios.get(`${BASE_URL}/dashboard/time-info`);
  return response.data;
};
