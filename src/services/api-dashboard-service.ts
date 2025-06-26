import axios from 'axios';
import { getAuthHeaders } from './jwt-service';

const BASE_URL = process.env.BASE_URL || '';

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

interface SecretaryDashboardData extends BaseDashboardData {
  totalConfirmed: number;
  totalFinished: number;
  finishedPercentage: number;
  averageWaitingTimeMinutes: number;
}

interface AdminDashboardData extends BaseDashboardData {
  totalUsersActive: number;
  totalExamTypes: number;
}

export type DashboardData = SecretaryDashboardData | AdminDashboardData;

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
