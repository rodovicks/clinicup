'use client';
import React, { useEffect, useState } from 'react';
import {
  useAppointments,
  Appointment,
  AppointmentFilters,
} from '@/contexts/appoiments-context';
import { EditAppointment } from './editAppointment';
import RemoveAppointment from './removeAppointment';
import { DialogTrigger } from '@/components/ui/dialog';

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
    filters,
    setFilters,
  } = useAppointments();

  const [localFilters, setLocalFilters] = useState<AppointmentFilters>({
    search: '',
    examsTypeId: '',
    status: '',
    startDate: '',
    endDate: '',
  });

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

  const handleFilterChange = (
    field: keyof AppointmentFilters,
    value: string
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
    setCurrentPage(1);
    fetchAppointments(1, localFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      examsTypeId: '',
      status: '',
      startDate: '',
      endDate: '',
    };
    setLocalFilters(emptyFilters);
    setFilters(emptyFilters);
    setCurrentPage(1);
    fetchAppointments(1, emptyFilters);
  };

  useEffect(() => {
    fetchAppointments(1);
  }, []);

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nome, email, CPF ou telefone"
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Exame
            </label>
            <select
              value={localFilters.examsTypeId}
              onChange={(e) =>
                handleFilterChange('examsTypeId', e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="">Todos os tipos</option>
              {examTypes.map((examType) => (
                <option key={examType.id} value={examType.id}>
                  {examType.name}
                </option>
              ))}
            </select>
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={localFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="">Todos os status</option>
              <option value="SCHEDULED">Agendado</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="WAITING_APPOIMENT">Aguardando Consulta</option>
              <option value="IN_APPOINTMENT">Em Consulta</option>
              <option value="FINISIHED">Finalizado</option>
              <option value="CANCELED">Cancelado</option>
              <option value="GIVEN_UP">Desistiu</option>
              <option value="NO_SHOW">Não Compareceu</option>
            </select>
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início
            </label>
            <input
              type="date"
              value={localFilters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fim
            </label>
            <input
              type="date"
              value={localFilters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>

        {}
        <div className="flex gap-3">
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {}
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
                        <EditAppointment
                          appointment={
                            appointment as Required<Pick<Appointment, 'id'>> &
                              Appointment
                          }
                          examTypes={examTypes}
                        />
                        <RemoveAppointment appointmentId={appointment.id} />
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

export default AppointmentTable;
