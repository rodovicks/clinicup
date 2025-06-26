'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Check, ChevronsUpDown } from 'lucide-react';
import { DateDisplay } from '@/components/ui/date-display';
import type { ExamType as ApiExamType } from '@/contexts/exams-context';
import type {
  RealTimeDashboardResponse,
  ExamType,
} from '@/services/api-dashboard-realtime-service';

interface ValidExamType extends ApiExamType {
  id: string;
}

const SchedulePage = () => {
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);
  const [dashboardData, setDashboardData] =
    useState<RealTimeDashboardResponse | null>(null);
  const [examTypes, setExamTypes] = useState<ApiExamType[]>([]);
  const [selectedExamTypeIds, setSelectedExamTypeIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentDateTime(new Date());

    const loadData = async () => {
      try {
        const [dashboardResponse, examTypesResponse] = await Promise.all([
          axios.get('/api/dashboard/real-time', {
            params: selectedExamTypeIds.length
              ? { examTypeIds: selectedExamTypeIds.join(',') }
              : undefined,
          }),
          axios.get('/api/exam/types'),
        ]);

        setDashboardData(dashboardResponse.data);
        setExamTypes(examTypesResponse.data.data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados do painel');
      }
    };

    loadData();
    const dataInterval = setInterval(loadData, 20000);

    const clockInterval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 30000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(clockInterval);
    };
  }, [selectedExamTypeIds]);

  const currentPatient = dashboardData?.inProgress[0];

  const validExamTypes = examTypes.filter(
    (type): type is ValidExamType => typeof type.id === 'string'
  );

  const examTypeNames = validExamTypes
    .filter((type) => selectedExamTypeIds.includes(type.id))
    .map((type) => type.name);

  if (error) {
    return (
      <div className="flex p-8 items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Erro</h2>
          <p>{error}</p>
        </Card>
      </div>
    );
  }

  const handleToggleExamType = (typeId: string) => {
    setSelectedExamTypeIds((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  return (
    <div className="flex p-8 items-center justify-center bg-gray-100">
      <Card className="p-8 w-full shadow-md">
        <header className="mb-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <button
                className="border border-gray-300 rounded-md p-2 w-96 flex items-center justify-between"
                onClick={() => setOpen((prev) => !prev)}
              >
                {selectedExamTypeIds.length > 0
                  ? examTypeNames.join(', ')
                  : 'Selecione os tipos de exame'}
                <ChevronsUpDown className="ml-2 h-4 w-4" />
              </button>
              {open && (
                <div className="absolute mt-2 border border-gray-300 rounded-md bg-white shadow-md w-96 z-50">
                  {validExamTypes.length === 0 ? (
                    <div className="p-2 text-gray-500">
                      Nenhum tipo de exame cadastrado
                    </div>
                  ) : (
                    validExamTypes.map((type) => (
                      <div
                        key={type.id}
                        className="p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleToggleExamType(type.id)}
                      >
                        <Check
                          className={`h-4 w-4 ${
                            selectedExamTypeIds.includes(type.id)
                              ? 'opacity-100'
                              : 'opacity-0'
                          }`}
                        />
                        {type.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-around">
            <div className="rounded-md bg-gray-200 p-8">
              <h2 className="text-xl font-bold text-sky-500 mt-4">
                Tempo padrão do exame
              </h2>
              <p className="text-gray-700 text-2xl">
                {(currentPatient?.examsType as ExamType)?.defaultDuration ||
                  '-'}
              </p>
            </div>
            <div className="rounded-md bg-gray-200 p-8">
              <h1 className="text-2xl font-bold text-sky-500">Agendamentos</h1>
              <div suppressHydrationWarning className="text-gray-700 text-2xl">
                {currentDateTime && (
                  <DateDisplay date={currentDateTime} format="datetime" />
                )}
              </div>
            </div>
            <div className="rounded-md bg-gray-200 p-8">
              <h2 className="text-xl font-bold text-sky-500 mt-4">
                Tempo médio de atendimento
              </h2>
              <p className="text-gray-700 text-2xl">
                {dashboardData?.averageTimes[0]?.averageTimeMinutes || '-'}{' '}
                minutos
              </p>
            </div>
          </div>
        </header>
        <div className="mb-6 text-center">
          <h2 className="text-6xl font-bold mb-4 text-sky-500">
            {currentPatient?.patient_name || 'Nenhum paciente em atendimento'}
          </h2>
          <p className="text-2xl text-gray-700 mb-4">
            Exame:{' '}
            {currentPatient?.examsType.name || 'Nenhum exame em andamento'}
          </p>
        </div>
        <div className="flex gap-8">
          <div className="w-1/2">
            <h2 className="text-lg font-semibold text-center mb-4">
              Fila de Agendamentos
            </h2>
            <table className="w-full h-96 max-h-96 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Paciente</th>
                  <th className="border border-gray-300 p-2">Exame</th>
                  <th className="border border-gray-300 p-2">Previsão</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.confirmed.map((patient) => (
                  <tr key={patient.id}>
                    <td className="border border-gray-300 p-2">
                      {patient.patient_name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {patient.examsType.name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <div suppressHydrationWarning>
                        <DateDisplay date={patient.date_start} />
                      </div>
                      <div className="text-sm text-gray-500">
                        Espera: {patient.estimatedWaitTimeMinutes}min
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-1/2">
            <h2 className="text-lg font-semibold text-center mb-4">
              Exames Realizados
            </h2>
            <table className="w-full h-96 max-h-96 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Paciente</th>
                  <th className="border border-gray-300 p-2">Exame</th>
                  <th className="border border-gray-300 p-2">Início</th>
                  <th className="border border-gray-300 p-2">Fim</th>
                  <th className="border border-gray-300 p-2">Duração</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.finished.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="border border-gray-300 p-2">
                      {appointment.patient_name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {appointment.examsType.name}
                    </td>
                    <td
                      className="border border-gray-300 p-2"
                      suppressHydrationWarning
                    >
                      <DateDisplay date={appointment.date_start} />
                    </td>
                    <td
                      className="border border-gray-300 p-2"
                      suppressHydrationWarning
                    >
                      <DateDisplay date={appointment.finishedDate} />
                    </td>
                    <td className="border border-gray-300 p-2">
                      {appointment.actualDurationMinutes}min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SchedulePage;
