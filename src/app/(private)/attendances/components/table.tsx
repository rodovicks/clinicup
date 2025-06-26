'use client';
import React from 'react';
import { useAppointments } from '@/contexts/appoiments-context';
import RemoveAppointment from './removeAppointment';
import { CheckCircle, Ban, XCircle, Clock } from 'lucide-react';

interface AppointmentProps {
  examTypes: Array<{ id: string; name: string; defaultDuration?: number }>;
}

const AttendancesTable = ({ examTypes }: AppointmentProps) => {
  const {
    appointments,
    currentPage,
    fetchAppointments,
    totalPages,
    loading,
    setCurrentPage,
    filters,
    setFilters,
    updateAppointmentStatus,
  } = useAppointments();

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchAppointments(currentPage - 1, filters);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(Number(currentPage) + 1);
      fetchAppointments(Number(currentPage) + 1, filters);
    }
  };

  const getStatusDisplay = (status: string) => {
    const statusMap = {
      SCHEDULED: 'Agendado',
      CONFIRMED: 'Confirmado',
      WAITING_APPOIMENT: 'Aguardando Consulta',
      IN_APPOINTMENT: 'Em Consulta',
      FINISIHED: 'Finalizado',
      CANCELED: 'Cancelado',
      GIVEN_UP: 'Desistiu',
      NO_SHOW: 'Não Compareceu',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      SCHEDULED: 'text-blue-600 bg-blue-100',
      CONFIRMED: 'text-green-600 bg-green-100',
      WAITING_APPOIMENT: 'text-yellow-600 bg-yellow-100',
      IN_APPOINTMENT: 'text-purple-600 bg-purple-100',
      FINISIHED: 'text-gray-600 bg-gray-100',
      CANCELED: 'text-red-600 bg-red-100',
      GIVEN_UP: 'text-orange-600 bg-orange-100',
      NO_SHOW: 'text-red-800 bg-red-200',
    };
    return (
      colorMap[status as keyof typeof colorMap] || 'text-gray-600 bg-gray-100'
    );
  };

  return (
    <div>
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
                    {new Date(appointment.date_end).toLocaleDateString(
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
                      <>
                        <RemoveAppointment appointmentId={appointment.id} />
                        {/* Ícones de status */}
                        <button
                          title="Finalizar"
                          onClick={async () =>
                            await updateAppointmentStatus(appointment.id!, {
                              status: 'FINISHED',
                            })
                          }
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button
                          title="Desistência"
                          onClick={async () =>
                            await updateAppointmentStatus(appointment.id!, {
                              status: 'GIVEN_UP',
                            })
                          }
                          className="text-orange-500 hover:text-orange-700"
                        >
                          <XCircle size={20} />
                        </button>
                        <button
                          title="Cancelar"
                          onClick={async () =>
                            await updateAppointmentStatus(appointment.id!, {
                              status: 'CANCELED',
                            })
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <Ban size={20} />
                        </button>
                        <button
                          title="Em atraso"
                          onClick={async () =>
                            await updateAppointmentStatus(appointment.id!, {
                              status: 'NO_SHOW',
                            })
                          }
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <Clock size={20} />
                        </button>
                      </>
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
    </div>
  );
};

export default AttendancesTable;
