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
  date: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  details: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AppointmentsContextType {
  appointments: Appointment[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  loading: boolean;
  setCurrentPage: (page: number) => void;
  fetchAppointments: (page?: number) => Promise<void>;
  saveAppointment: (appointment: Appointment) => Promise<void>;
  updateAppointment: (id: string, appointment: Appointment) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}

const AppointmentsContext = createContext<AppointmentsContextType | null>(null);

export const AppointmentsProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const fetchAppointments = async (page = currentPage) => {
    await withLoading(async () => {
      const response = await axios.get('/api/appointments', {
        params: { page },
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
        setCurrentPage,
        fetchAppointments,
        saveAppointment: handleSaveAppointment,
        updateAppointment: handleUpdateAppointment,
        deleteAppointment: handleDeleteAppointment,
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
