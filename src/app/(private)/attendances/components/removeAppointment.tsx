import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { useAppointments } from '@/contexts/appoiments-context';
import { XCircle } from 'lucide-react';

const RemoveAppointment = ({
  appointmentId,
  appointmentStatus,
  status = 'CANCELED',
}: {
  appointmentId: string;
  appointmentStatus: string;
  status?: string;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const { updateAppointmentStatus } = useAppointments();

  const canCancel = !['FINISIHED', 'CANCELED', 'GIVEN_UP', 'NO_SHOW'].includes(
    appointmentStatus
  );

  const handleCancel = async () => {
    if (!canCancel) return;

    const details = cancelReason.trim()
      ? `Cancelado em: ${new Date().toLocaleString(
          'pt-BR'
        )} - Motivo: ${cancelReason}`
      : `Cancelado em: ${new Date().toLocaleString('pt-BR')}`;

    await updateAppointmentStatus(appointmentId, {
      status,
      details,
    });
    setIsDialogOpen(false);
    setCancelReason('');
  };

  if (!canCancel) {
    return null;
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button
            className="text-red-500 hover:text-red-700"
            aria-label="Cancel"
          >
            <XCircle size={16} />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Cancelamento</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja cancelar este agendamento? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="Motivo do cancelamento (opcional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="min-h-20"
            />
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setIsDialogOpen(false);
                setCancelReason('');
              }}
            >
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RemoveAppointment;
