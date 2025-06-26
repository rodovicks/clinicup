import axios from 'axios';
import { getAuthHeaders } from './jwt-service';

const BASE_URL = process.env.BASE_URL || '';

// Interface base com campos comuns
interface BaseDashboardData {
  totalPatients: number;
  totalAppoiments: number;
  weeklyStatusCount: {
    [key: string]: {
      SCHEDULED: number;
      CONFIRMED: number;
      WAITING_APPOIMENT: number;
      IN_APPOINTMENT: number;
      FINISIHED: number;
      CANCELED: number;
      GIVEN_UP: number;
      NO_SHOW: number;
    };
  };
}

// Interface para secretária
interface SecretaryDashboardData extends BaseDashboardData {
  totalConfirmed: number;
  totalFinished: number;
  finishedPercentage: number;
  averageWaitingTimeMinutes: number;
}

// Interface para admin
interface AdminDashboardData extends BaseDashboardData {
  totalUsersActive: number;
  totalExamTypes: number;
}

// União dos tipos possíveis
export type DashboardData = SecretaryDashboardData | AdminDashboardData;

// Helper para verificar se é dashboard do admin
export const isAdminDashboard = (
  dashboard: DashboardData
): dashboard is AdminDashboardData => {
  return 'totalUsersActive' in dashboard;
};

export const getDashboardData = async (): Promise<DashboardData> => {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${BASE_URL}/dashboard`, {
    headers,
  });

  return response.data;
};
