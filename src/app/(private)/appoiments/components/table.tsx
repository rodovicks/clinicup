'use client';
import React, { useEffect } from 'react';
import { useAppointments, Appointment } from '@/contexts/appoiments-context';
import { EditAppointment } from './editAppointment';

interface AppointmentProps {
  examTypes: Array<{ id: string; name: string; defaultDuration?: number }>;
}

const AppointmentTable = ({ examTypes }: AppointmentProps) => {
  const {
    appointments,
    currentPage,
    fetchAppointments,
    totalPages,
    loading,
    setCurrentPage,
  } = useAppointments();

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchAppointments(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(Number(currentPage) + 1);
      fetchAppointments(Number(currentPage) + 1);
    }
  };

  const getStatusDisplay = (status: string) => {
    const statusMap = {
      SCHEDULED: 'Agendado',
      CONFIRMED: 'Confirmado',
      COMPLETED: 'Concluído',
      CANCELLED: 'Cancelado',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      SCHEDULED: 'text-blue-600 bg-blue-100',
      CONFIRMED: 'text-green-600 bg-green-100',
      COMPLETED: 'text-gray-600 bg-gray-100',
      CANCELLED: 'text-red-600 bg-red-100',
    };
    return (
      colorMap[status as keyof typeof colorMap] || 'text-gray-600 bg-gray-100'
    );
  };

  useEffect(() => {
    fetchAppointments(1);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200 bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Paciente
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              CPF
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Data de Início
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Data de Término
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-500">
                Carregando agendamentos...
              </td>
            </tr>
          ) : (
            appointments.map((appointment) => (
              <tr key={appointment.id} className="bg-white border-t">
                <td className="px-6 py-4 text-sm text-gray-700">
                  {appointment.patient_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {appointment.patient_cpf}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {appointment.patient_email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(appointment.date_start).toLocaleDateString(
                    'pt-BR',
                    {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(appointment.date_end).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {getStatusDisplay(appointment.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-2">
                  {appointment.id && (
                    <EditAppointment
                      appointment={
                        appointment as Required<Pick<Appointment, 'id'>> &
                          Appointment
                      }
                      examTypes={examTypes}
                    />
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={handlePrevious}
          disabled={Number(currentPage) <= 1}
          className={`px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600 ${
            Number(currentPage) === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={
            Number(currentPage) === Number(totalPages) || totalPages === 0
          }
          className={`px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600 ${
            Number(currentPage) === Number(totalPages) || totalPages === 0
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default AppointmentTable;
