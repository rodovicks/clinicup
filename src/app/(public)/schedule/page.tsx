'use client';

import React, { useState, useEffect } from 'react';
import { getAppointments } from '@/services/api-appoiments-service';
import { getExamTypes } from '@/services/api-exams-type-service';
import { Appointment } from '@/contexts/appoiments-context';
import { ExamType } from '@/contexts/exams-context';
import { Card } from '@/components/ui/card';
import { Check, ChevronsUpDown } from 'lucide-react';

const SchedulePage = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [selectedExamTypes, setSelectedExamTypes] = useState<string[]>([]);
  const [currentCall, setCurrentCall] = useState<Appointment | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const appointmentsData = (await getAppointments()).data;
      const examTypesData = (await getExamTypes()).data;
      setAppointments(appointmentsData);
      setExamTypes(examTypesData);

      const confirmedAppointments = appointmentsData.filter(
        (appointment) => appointment.status === 'CONFIRMED'
      );
      setCurrentCall(confirmedAppointments[0] || null);
    };

    loadData();

    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredAppointments = appointments.filter((appointment) =>
    selectedExamTypes.includes(appointment.examsTypeId)
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === 'CONFIRMED'
  );

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
                {selectedExamTypes.length > 0
                  ? selectedExamTypes
                      .map(
                        (val) =>
                          examTypes.find((type) => type.name === val)?.name
                      )
                      .join(', ')
                  : 'Selecione os tipos de exame'}
                <ChevronsUpDown className="ml-2 h-4 w-4" />
              </button>
              {open && (
                <div className="absolute mt-2 border border-gray-300 rounded-md bg-white shadow-md w-96">
                  {examTypes.length === 0 ? (
                    <div className="p-2 text-gray-500">
                      Nenhum tipo de exame cadastrado
                    </div>
                  ) : (
                    examTypes.map((type) => (
                      <div
                        key={type.id}
                        className="p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                        onClick={() =>
                          setSelectedExamTypes((prev) =>
                            prev.includes(type.name)
                              ? prev.filter((v) => v !== type.name)
                              : [...prev, type.name]
                          )
                        }
                      >
                        <Check
                          className={`h-4 w-4 ${
                            selectedExamTypes.includes(type.name)
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
                Tempo padrão do exame{' '}
              </h2>
              <p className="text-gray-700 text-2xl">
                {
                  examTypes.find((type) => type.id === currentCall?.examsTypeId)
                    ?.defaultDuration
                }{' '}
                minutos
              </p>
            </div>
            <div className="rounded-md bg-gray-200 p-8">
              <h1 className="text-2xl font-bold text-sky-500">Agendamentos</h1>
              <p className="text-gray-700 text-2xl">
                {currentDateTime.toLocaleString()}
              </p>
            </div>
            <div className="rounded-md bg-gray-200 p-8">
              <h2 className="text-xl font-bold text-sky-500 mt-4">
                Tempo médio de atendimento{' '}
              </h2>
              <p className="text-gray-700 text-2xl">20 minutos</p>
            </div>
          </div>
        </header>
        <div className="mb-6 text-center">
          <h2 className="text-6xl font-bold mb-4 text-sky-500">
            {currentCall?.patient_name ?? 'Nenhum paciente em atendimento'}
          </h2>
          <p className="text-2xl text-gray-700 mb-4">
            Exame:{' '}
            {examTypes.find((type) => type.id === currentCall?.examsTypeId)
              ?.name ?? 'Nenhum exame encontrado'}
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
                  <th className="border border-gray-300 p-2">Horário</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="border border-gray-300 p-2">
                      {appointment.patient_name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {
                        examTypes.find(
                          (type) => type.id === appointment.examsTypeId
                        )?.name
                      }
                    </td>
                    <td className="border border-gray-300 p-2">
                      {appointment.date_start}
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
                  <th className="border border-gray-300 p-2">Agendado</th>
                  <th className="border border-gray-300 p-2">Início</th>
                  <th className="border border-gray-300 p-2">Fim</th>
                </tr>
              </thead>
              <tbody>
                {completedAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="border border-gray-300 p-2">
                      {appointment.patient_name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {
                        examTypes.find(
                          (type) => type.id === appointment.examsTypeId
                        )?.name
                      }
                    </td>
                    <td className="border border-gray-300 p-2">
                      {appointment.date_start}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {appointment.createdAt}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {appointment.updatedAt}
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
