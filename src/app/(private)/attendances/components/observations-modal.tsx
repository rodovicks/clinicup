import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';

interface ObservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  observations: string;
  status: string;
}

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

const ObservationsModal: React.FC<ObservationsModalProps> = ({
  isOpen,
  onClose,
  patientName,
  observations,
  status,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            Detalhes do Atendimento
          </DialogTitle>
          <DialogDescription>
            Observações e histórico do agendamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Paciente:
            </label>
            <p className="text-sm text-gray-900 font-medium">{patientName}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Status Atual:
            </label>
            <p className="text-sm text-gray-900 font-medium">
              {getStatusDisplay(status)}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Observações e Histórico:
            </label>
            <ScrollArea className="h-32 w-full border rounded-md p-3 bg-gray-50">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {observations || 'Nenhuma observação registrada.'}
              </p>
            </ScrollArea>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} className="w-full">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObservationsModal;
