'use client';
import React, { useEffect, useState } from 'react';
import { useAppointments } from '@/contexts/appoiments-context';
import RemoveAppointment from './removeAppointment';
import QueueStats from './queue-stats';
import AttendanceFilters from './attendance-filters';
import {
  DataConfirmationModal,
  ExamCallModal,
  FinishExamModal,
  WithdrawalModal,
  NoShowModal,
} from './attendance-modals';
import ObservationsModal from './observations-modal';
import useMaxWaitTime from '@/hooks/use-max-wait-time';
import {
  CheckCircle,
  Ban,
  XCircle,
  Clock,
  Phone,
  UserCheck,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface AppointmentProps {
  examTypes: Array<{ id: string; name: string; defaultDuration?: number }>;
}

const AttendancesTable = ({ examTypes }: AppointmentProps) => {
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'onTime' | 'late'>(
    'all'
  );
  const [isLoading, setIsLoading] = useState(false);

  const [showDataConfirmation, setShowDataConfirmation] = useState(false);
  const [showExamCall, setShowExamCall] = useState(false);
  const [showFinishExam, setShowFinishExam] = useState(false);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [showNoShow, setShowNoShow] = useState(false);
  const [showObservations, setShowObservations] = useState(false);

  const [selectedAppointmentData, setSelectedAppointmentData] =
    useState<any>(null);

  const { maxWaitTime } = useMaxWaitTime();

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

  const getSortedAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let todayAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date_start);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate.getTime() === today.getTime();
    });

    if (statusFilter) {
      todayAppointments = todayAppointments.filter(
        (app) => app.status === statusFilter
      );
    }

    const onTimePatients: any[] = [];
    const latePatients: any[] = [];

    todayAppointments.forEach((appointment) => {
      const scheduledTime = new Date(appointment.date_start);
      const currentTime = new Date();

      const timeDifference =
        (currentTime.getTime() - scheduledTime.getTime()) / (1000 * 60);

      if (timeDifference <= maxWaitTime) {
        onTimePatients.push(appointment);
      } else {
        latePatients.push(appointment);
      }
    });

    onTimePatients.sort(
      (a, b) =>
        new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
    );
    latePatients.sort(
      (a, b) =>
        new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
    );

    let result = [...onTimePatients, ...latePatients];

    if (timeFilter === 'onTime') {
      result = onTimePatients;
    } else if (timeFilter === 'late') {
      result = latePatients;
    }

    return result;
  };

  const handleCallForDataConfirmation = (appointment: any) => {
    setSelectedAppointmentData(appointment);
    setShowDataConfirmation(true);
  };

  const handleConfirmData = async (observations: string) => {
    if (selectedAppointmentData) {
      setIsLoading(true);
      try {
        const detailsMessage = observations.trim()
          ? `Dados confirmados em: ${new Date().toLocaleString(
              'pt-BR'
            )} - Observações: ${observations}`
          : `Dados confirmados em: ${new Date().toLocaleString('pt-BR')}`;

        await updateAppointmentStatus(selectedAppointmentData.id, {
          status: 'WAITING_APPOIMENT',
          details: detailsMessage,
        });
        setShowDataConfirmation(false);
        setSelectedAppointmentData(null);
      } catch (error) {
        console.error('Erro ao confirmar dados:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCallForExam = (appointment: any) => {
    setSelectedAppointmentData(appointment);
    setShowExamCall(true);
  };

  const handleConfirmExamCall = async () => {
    if (selectedAppointmentData) {
      setIsLoading(true);
      try {
        await updateAppointmentStatus(selectedAppointmentData.id, {
          status: 'IN_APPOINTMENT',
          details: `Chamado para exame em: ${new Date().toLocaleString(
            'pt-BR'
          )}`,
        });
        setShowExamCall(false);
        setSelectedAppointmentData(null);
      } catch (error) {
        console.error('Erro ao chamar para exame:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFinishExam = (appointment: any) => {
    setSelectedAppointmentData(appointment);
    setShowFinishExam(true);
  };

  const handleConfirmFinishExam = async (observations: string) => {
    if (selectedAppointmentData) {
      setIsLoading(true);
      try {
        const startTime = new Date(selectedAppointmentData.date_start);
        const endTime = new Date();
        const durationMinutes = Math.round(
          (endTime.getTime() - startTime.getTime()) / (1000 * 60)
        );

        const detailsMessage = observations.trim()
          ? `Exame finalizado em: ${endTime.toLocaleString(
              'pt-BR'
            )} - Duração: ${durationMinutes} minutos - Observações: ${observations}`
          : `Exame finalizado em: ${endTime.toLocaleString(
              'pt-BR'
            )} - Duração: ${durationMinutes} minutos`;

        await updateAppointmentStatus(selectedAppointmentData.id, {
          status: 'FINISIHED',
          details: detailsMessage,
          finishedTime: endTime.toISOString(),
        });
        setShowFinishExam(false);
        setSelectedAppointmentData(null);
      } catch (error) {
        console.error('Erro ao finalizar exame:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleWithdrawal = (appointment: any) => {
    setSelectedAppointmentData(appointment);
    setShowWithdrawal(true);
  };

  const handleConfirmWithdrawal = async (reason: string) => {
    if (selectedAppointmentData) {
      setIsLoading(true);
      try {
        await updateAppointmentStatus(selectedAppointmentData.id, {
          status: 'GIVEN_UP',
          details: `Desistência: ${reason} - ${new Date().toLocaleString(
            'pt-BR'
          )}`,
        });
        setShowWithdrawal(false);
        setSelectedAppointmentData(null);
      } catch (error) {
        console.error('Erro ao registrar desistência:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNoShow = (appointment: any) => {
    setSelectedAppointmentData(appointment);
    setShowNoShow(true);
  };

  const handleConfirmNoShow = async () => {
    if (selectedAppointmentData) {
      setIsLoading(true);
      try {
        await updateAppointmentStatus(selectedAppointmentData.id, {
          status: 'NO_SHOW',
          details: `Ausência registrada em: ${new Date().toLocaleString(
            'pt-BR'
          )}`,
        });
        setShowNoShow(false);
        setSelectedAppointmentData(null);
      } catch (error) {
        console.error('Erro ao registrar ausência:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const closeAllModals = () => {
    setShowDataConfirmation(false);
    setShowExamCall(false);
    setShowFinishExam(false);
    setShowWithdrawal(false);
    setShowNoShow(false);
    setShowObservations(false);
    setSelectedAppointmentData(null);
  };

  const handleShowObservations = (appointment: any) => {
    setSelectedAppointmentData(appointment);
    setShowObservations(true);
  };

  useEffect(() => {
    fetchAppointments(currentPage, filters);
  }, [currentPage, filters]);

  return (
    <div>
      {}
      <DataConfirmationModal
        isOpen={showDataConfirmation}
        onClose={closeAllModals}
        onConfirm={handleConfirmData}
        patientName={selectedAppointmentData?.patient_name || ''}
        isLoading={isLoading}
      />

      <ExamCallModal
        isOpen={showExamCall}
        onClose={closeAllModals}
        onConfirm={handleConfirmExamCall}
        patientName={selectedAppointmentData?.patient_name || ''}
        scheduledTime={
          selectedAppointmentData
            ? new Date(selectedAppointmentData.date_start).toLocaleTimeString(
                'pt-BR',
                {
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )
            : ''
        }
        isLoading={isLoading}
      />

      <FinishExamModal
        isOpen={showFinishExam}
        onClose={closeAllModals}
        onConfirm={handleConfirmFinishExam}
        patientName={selectedAppointmentData?.patient_name || ''}
        startTime={selectedAppointmentData?.date_start || ''}
        isLoading={isLoading}
      />

      <WithdrawalModal
        isOpen={showWithdrawal}
        onClose={closeAllModals}
        onConfirm={handleConfirmWithdrawal}
        patientName={selectedAppointmentData?.patient_name || ''}
        isLoading={isLoading}
      />

      <NoShowModal
        isOpen={showNoShow}
        onClose={closeAllModals}
        onConfirm={handleConfirmNoShow}
        patientName={selectedAppointmentData?.patient_name || ''}
        scheduledTime={
          selectedAppointmentData
            ? new Date(selectedAppointmentData.date_start).toLocaleTimeString(
                'pt-BR',
                {
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )
            : ''
        }
        currentDelayMinutes={
          selectedAppointmentData
            ? Math.round(
                (new Date().getTime() -
                  new Date(selectedAppointmentData.date_start).getTime()) /
                  (1000 * 60)
              )
            : 0
        }
        maxWaitTime={maxWaitTime}
        isLoading={isLoading}
      />

      <ObservationsModal
        isOpen={showObservations}
        onClose={closeAllModals}
        patientName={selectedAppointmentData?.patient_name || ''}
        observations={
          selectedAppointmentData?.statusDetails ||
          selectedAppointmentData?.details ||
          ''
        }
        status={selectedAppointmentData?.status || ''}
      />

      {}
      <QueueStats appointments={appointments} maxWaitTime={maxWaitTime} />

      {}
      <AttendanceFilters
        onStatusFilter={setStatusFilter}
        onTimeFilter={setTimeFilter}
        activeStatus={statusFilter}
        activeTimeFilter={timeFilter}
      />

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">
          Fila de Atendimento - {new Date().toLocaleDateString('pt-BR')}
        </h2>
        <p className="text-sm text-blue-600">
          Pacientes são ordenados por: 1º) Horário de agendamento (pontuais),
          2º) Pacientes em atraso
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Posição
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                CPF
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Horário Agendado
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Situação
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
              getSortedAppointments().map((appointment, index) => {
                const scheduledTime = new Date(appointment.date_start);
                const currentTime = new Date();
                const timeDifference =
                  (currentTime.getTime() - scheduledTime.getTime()) /
                  (1000 * 60);
                const isLate = timeDifference > maxWaitTime;

                return (
                  <tr
                    key={appointment.id}
                    className={`border-t ${isLate ? 'bg-red-50' : 'bg-white'}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {index + 1}º
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        {appointment.patient_name}
                        {isLate && (
                          <AlertTriangle size={16} className="text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {appointment.patient_cpf}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(appointment.date_start).toLocaleTimeString(
                        'pt-BR',
                        {
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
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {isLate ? (
                        <span className="text-red-600 font-medium">
                          Em atraso
                        </span>
                      ) : (
                        <span className="text-green-600 font-medium">
                          Pontual
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-2 flex-wrap">
                        {appointment.id && (
                          <>
                            {}
                            {appointment.status === 'CONFIRMED' && (
                              <button
                                title="Chamar para confirmação de dados"
                                onClick={() =>
                                  handleCallForDataConfirmation(appointment)
                                }
                                className="text-blue-600 hover:text-blue-800 p-1"
                              >
                                <Phone size={16} />
                              </button>
                            )}

                            {}
                            {appointment.status === 'WAITING_APPOIMENT' && (
                              <button
                                title="Chamar para exame"
                                onClick={() => handleCallForExam(appointment)}
                                className="text-purple-600 hover:text-purple-800 p-1"
                              >
                                <UserCheck size={16} />
                              </button>
                            )}

                            {}
                            {appointment.status === 'IN_APPOINTMENT' && (
                              <button
                                title="Finalizar exame"
                                onClick={() => handleFinishExam(appointment)}
                                className="text-green-600 hover:text-green-800 p-1"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}

                            {}
                            {['CONFIRMED', 'WAITING_APPOIMENT'].includes(
                              appointment.status
                            ) && (
                              <button
                                title="Registrar desistência"
                                onClick={() => handleWithdrawal(appointment)}
                                className="text-orange-500 hover:text-orange-700 p-1"
                              >
                                <XCircle size={16} />
                              </button>
                            )}

                            {}
                            {appointment.status === 'CONFIRMED' &&
                              isLate &&
                              timeDifference > maxWaitTime * 2 && (
                                <button
                                  title="Registrar ausência"
                                  onClick={() => handleNoShow(appointment)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <Clock size={16} />
                                </button>
                              )}

                            {}
                            <button
                              title={
                                appointment.statusDetails || appointment.details
                                  ? 'Ver detalhes e observações'
                                  : 'Ver informações do agendamento'
                              }
                              onClick={() =>
                                handleShowObservations(appointment)
                              }
                              className="text-gray-600 hover:text-gray-800 p-1"
                            >
                              <FileText size={16} />
                            </button>

                            {}
                            <RemoveAppointment
                              appointmentId={appointment.id}
                              appointmentStatus={appointment.status}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
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
