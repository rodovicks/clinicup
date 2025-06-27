'use client';
import React from 'react';

interface AttendanceFiltersProps {
  onStatusFilter: (status: string) => void;
  onTimeFilter: (timeFilter: 'all' | 'onTime' | 'late') => void;
  activeStatus: string;
  activeTimeFilter: string;
}

export const AttendanceFilters = ({
  onStatusFilter,
  onTimeFilter,
  activeStatus,
  activeTimeFilter,
}: AttendanceFiltersProps) => {
  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'CONFIRMED', label: 'Confirmados' },
    { value: 'WAITING_APPOIMENT', label: 'Aguardando Consulta' },
    { value: 'IN_APPOINTMENT', label: 'Em Consulta' },
    { value: 'FINISIHED', label: 'Finalizados' },
    { value: 'GIVEN_UP', label: 'Desistências' },
    { value: 'NO_SHOW', label: 'Ausências' },
  ];

  const timeOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'onTime', label: 'Pontuais' },
    { value: 'late', label: 'Em Atraso' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Filtros de Atendimento
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Status:
          </label>
          <select
            value={activeStatus}
            onChange={(e) => onStatusFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Pontualidade:
          </label>
          <select
            value={activeTimeFilter}
            onChange={(e) =>
              onTimeFilter(e.target.value as 'all' | 'onTime' | 'late')
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Legenda de Ações:
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Chamar p/ dados</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Chamar p/ exame</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Finalizar</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Desistência</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Ausência</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceFilters;
