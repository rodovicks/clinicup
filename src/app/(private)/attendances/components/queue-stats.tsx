'use client';
import React from 'react';
import { Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';

interface QueueStatsProps {
  appointments: Array<{
    id?: string;
    patient_name: string;
    date_start: string;
    status: string;
  }>;
  maxWaitTime?: number;
}

export const QueueStats = ({
  appointments,
  maxWaitTime = 30,
}: QueueStatsProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date_start);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate.getTime() === today.getTime();
  });

  const totalPatients = todayAppointments.length;
  const waitingPatients = todayAppointments.filter(
    (app) => app.status === 'CONFIRMED' || app.status === 'WAITING_APPOIMENT'
  ).length;
  const inProgress = todayAppointments.filter(
    (app) => app.status === 'IN_APPOINTMENT'
  ).length;
  const completed = todayAppointments.filter(
    (app) => app.status === 'FINISIHED'
  ).length;

  const latePatients = todayAppointments.filter((appointment) => {
    const scheduledTime = new Date(appointment.date_start);
    const currentTime = new Date();
    const timeDifference =
      (currentTime.getTime() - scheduledTime.getTime()) / (1000 * 60);
    return (
      timeDifference > maxWaitTime &&
      (appointment.status === 'CONFIRMED' ||
        appointment.status === 'WAITING_APPOIMENT')
    );
  }).length;

  const stats = [
    {
      title: 'Total do Dia',
      value: totalPatients,
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Na Fila',
      value: waitingPatients,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      title: 'Em Atendimento',
      value: inProgress,
      icon: AlertTriangle,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Concluídos',
      value: completed,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 border">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${stat.color} mr-3`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}

      {}
      {latePatients > 0 && (
        <div className="md:col-span-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700 font-medium">
              {latePatients} paciente(s) em atraso superior a {maxWaitTime}{' '}
              minutos
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueStats;
