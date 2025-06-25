'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export interface Appointment {
  id?: string;
  patient_cpf: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  patient_birth_date: string;
  userId: string;
  examsTypeId: string;
  date_start: string;
  date_end: string;
  status:
    | 'SCHEDULED'
    | 'CONFIRMED'
    | 'WAITING_APPOIMENT'
    | 'IN_APPOINTMENT'
    | 'FINISHED'
    | 'CANCELED'
    | 'GIVEN_UP'
    | 'NO_SHOW';
  details: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentFilters {
  search?: string;
  examsTypeId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

interface AppointmentsContextType {
  appointments: Appointment[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  loading: boolean;
  filters: AppointmentFilters;
  setCurrentPage: (page: number) => void;
  setFilters: (filters: AppointmentFilters) => void;
  fetchAppointments: (
    page?: number,
    filters?: AppointmentFilters
  ) => Promise<void>;
  saveAppointment: (appointment: Appointment) => Promise<void>;
  updateAppointment: (id: string, appointment: Appointment) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  updateAppointmentStatus: (
    id: string,
    statusUpdate: { status: string }
  ) => Promise<void>;
}

const AppointmentsContext = createContext<AppointmentsContextType | null>(null);

export const AppointmentsProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AppointmentFilters>({});

  const withLoading = async (callback: () => Promise<void>) => {
    setLoading(true);
    try {
      await callback();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || error.message || 'Erro inesperado'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async (
    page = currentPage,
    filterParams = filters
  ) => {
    await withLoading(async () => {
      const params: any = { page };

      if (filterParams.search) params.search = filterParams.search;
      if (filterParams.examsTypeId)
        params.examsTypeId = filterParams.examsTypeId;
      if (filterParams.status) params.status = filterParams.status;
      if (filterParams.startDate) params.startDate = filterParams.startDate;
      if (filterParams.endDate) params.endDate = filterParams.endDate;

      const response = await axios.get('/api/appointments', {
        params,
      });
      const data = response.data;

      setAppointments(data.data);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    });
  };

  const handleSaveAppointment = async (appointment: Appointment) => {
    await withLoading(async () => {
      await axios.post('/api/appointments', appointment);
      toast.success('Agendamento salvo com sucesso!');
      await fetchAppointments(currentPage);
    });
  };

  const handleUpdateAppointment = async (
    id: string,
    appointment: Appointment
  ) => {
    await withLoading(async () => {
      await axios.put(`/api/appointments/${id}`, appointment);
      toast.success('Agendamento atualizado com sucesso!');
      await fetchAppointments(currentPage);
    });
  };

  const handleUpdateAppointmentStatus = async (
    id: string,
    statusUpdate: { status: string }
  ) => {
    await withLoading(async () => {
      await axios.patch(`/api/appointments/${id}/status`, statusUpdate);
      toast.success('Status do agendamento atualizado com sucesso!');
      await fetchAppointments(currentPage);
    });
  };

  const handleDeleteAppointment = async (id: string) => {
    await withLoading(async () => {
      await axios.delete(`/api/appointments/${id}`);
      toast.success('Agendamento excluído com sucesso!');
      await fetchAppointments(currentPage);
    });
  };

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        currentPage,
        totalPages,
        totalItems,
        loading,
        filters,
        setCurrentPage,
        setFilters,
        fetchAppointments,
        saveAppointment: handleSaveAppointment,
        updateAppointment: handleUpdateAppointment,
        deleteAppointment: handleDeleteAppointment,
        updateAppointmentStatus: handleUpdateAppointmentStatus,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointments = (): AppointmentsContextType => {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error('Erro ao acessar o contexto de agendamentos.');
  }
  return context;
};
