'use client';
import React, { useState } from 'react';
import {
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Phone,
} from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data?: any) => void;
  title: string;
  children: React.ReactNode;
  confirmButtonText?: string;
  confirmButtonColor?: string;
  isLoading?: boolean;
}

const BaseModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmButtonText = 'Confirmar',
  confirmButtonColor = 'bg-blue-500 hover:bg-blue-600',
  isLoading = false,
}: BaseModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">{children}</div>

        <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm()}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50 ${confirmButtonColor}`}
          >
            {isLoading ? 'Processando...' : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

interface DataConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (observations: string) => void;
  patientName: string;
  isLoading?: boolean;
}

export const DataConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  patientName,
  isLoading = false,
}: DataConfirmationModalProps) => {
  const [observations, setObservations] = useState('');

  const handleConfirm = () => {
    onConfirm(observations);
    setObservations('');
  };

  const handleClose = () => {
    setObservations('');
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Confirmação de Dados do Paciente"
      confirmButtonText="Confirmar Dados"
      confirmButtonColor="bg-blue-500 hover:bg-blue-600"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Phone className="text-blue-600" size={20} />
          <span className="font-medium text-blue-800">
            Paciente: {patientName}
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações (opcional):
          </label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Digite observações sobre a confirmação dos dados..."
          />
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <strong>Ação:</strong> Após confirmar, o paciente será movido para a
          fila de espera para exame.
        </div>
      </div>
    </BaseModal>
  );
};

interface ExamCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patientName: string;
  scheduledTime: string;
  isLoading?: boolean;
}

export const ExamCallModal = ({
  isOpen,
  onClose,
  onConfirm,
  patientName,
  scheduledTime,
  isLoading = false,
}: ExamCallModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Chamar Paciente para Exame"
      confirmButtonText="Chamar para Exame"
      confirmButtonColor="bg-purple-500 hover:bg-purple-600"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
          <CheckCircle className="text-purple-600" size={20} />
          <div>
            <div className="font-medium text-purple-800">{patientName}</div>
            <div className="text-sm text-purple-600">
              Horário: {scheduledTime}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <strong>
            Confirma a chamada do paciente para realização do exame?
          </strong>
          <br />O status será alterado para &quot;Em Consulta&quot;.
        </div>
      </div>
    </BaseModal>
  );
};

interface FinishExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (observations: string) => void;
  patientName: string;
  startTime: string;
  isLoading?: boolean;
}

export const FinishExamModal = ({
  isOpen,
  onClose,
  onConfirm,
  patientName,
  startTime,
  isLoading = false,
}: FinishExamModalProps) => {
  const [observations, setObservations] = useState('');

  const handleConfirm = () => {
    onConfirm(observations);
    setObservations('');
  };

  const handleClose = () => {
    setObservations('');
    onClose();
  };

  const calculateDuration = () => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMinutes = Math.round(
      (now.getTime() - start.getTime()) / (1000 * 60)
    );
    return diffMinutes;
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Finalizar Exame"
      confirmButtonText="Finalizar Exame"
      confirmButtonColor="bg-green-500 hover:bg-green-600"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
          <CheckCircle className="text-green-600" size={20} />
          <div>
            <div className="font-medium text-green-800">{patientName}</div>
            <div className="text-sm text-green-600">
              Duração: {calculateDuration()} minutos
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações finais (opcional):
          </label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            rows={3}
            placeholder="Digite observações sobre o exame realizado..."
          />
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <strong>Atenção:</strong> Esta ação registrará a finalização do exame
          e será considerada no cálculo do tempo médio de atendimento.
        </div>
      </div>
    </BaseModal>
  );
};

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  patientName: string;
  isLoading?: boolean;
}

export const WithdrawalModal = ({
  isOpen,
  onClose,
  onConfirm,
  patientName,
  isLoading = false,
}: WithdrawalModalProps) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const handleConfirm = () => {
    const finalReason =
      selectedReason === 'outro' ? customReason : selectedReason;
    if (finalReason.trim()) {
      onConfirm(finalReason);
      setSelectedReason('');
      setCustomReason('');
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    onClose();
  };

  const predefinedReasons = [
    'Problema pessoal urgente',
    'Não se sente bem',
    'Conflito de horário',
    'Mudança de agenda',
    'Outros motivos pessoais',
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Registrar Desistência"
      confirmButtonText="Confirmar Desistência"
      confirmButtonColor="bg-orange-500 hover:bg-orange-600"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
          <XCircle className="text-orange-600" size={20} />
          <span className="font-medium text-orange-800">
            Paciente: {patientName}
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivo da desistência: *
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-2"
          >
            <option value="">Selecione um motivo</option>
            {predefinedReasons.map((motivo, index) => (
              <option key={index} value={motivo}>
                {motivo}
              </option>
            ))}
            <option value="outro">Outro motivo</option>
          </select>

          {selectedReason === 'outro' && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              rows={3}
              placeholder="Descreva o motivo da desistência..."
            />
          )}
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <strong>Importante:</strong> O paciente será mantido na lista com
          status de desistência e não será contabilizado no tempo médio de
          atendimento.
        </div>
      </div>
    </BaseModal>
  );
};

interface NoShowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patientName: string;
  scheduledTime: string;
  currentDelayMinutes: number;
  maxWaitTime: number;
  isLoading?: boolean;
}

export const NoShowModal = ({
  isOpen,
  onClose,
  onConfirm,
  patientName,
  scheduledTime,
  currentDelayMinutes,
  maxWaitTime,
  isLoading = false,
}: NoShowModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Registrar Ausência do Paciente"
      confirmButtonText="Confirmar Ausência"
      confirmButtonColor="bg-red-500 hover:bg-red-600"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
          <AlertTriangle className="text-red-600" size={20} />
          <div>
            <div className="font-medium text-red-800">{patientName}</div>
            <div className="text-sm text-red-600">
              Horário agendado: {scheduledTime}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-yellow-600" size={16} />
            <span className="font-medium text-yellow-800">
              Situação de Atraso
            </span>
          </div>
          <div className="text-sm text-yellow-700">
            <p>
              • Atraso atual: <strong>{currentDelayMinutes} minutos</strong>
            </p>
            <p>
              • Tempo máximo configurado: <strong>{maxWaitTime} minutos</strong>
            </p>
            <p>
              • Limite para ausência: <strong>{maxWaitTime * 2} minutos</strong>
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <strong>Atenção:</strong> Esta ação registrará a ausência definitiva
          do paciente. Será necessário realizar um novo agendamento para a
          realização do exame.
        </div>
      </div>
    </BaseModal>
  );
};
