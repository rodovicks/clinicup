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

import { useAppointments } from '@/contexts/appoiments-context';
import { XCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const RemoveAppointment = ({
  appointmentId,
  status = 'CANCELED',
}: {
  appointmentId: string;
  status?: string;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const { updateAppointmentStatus } = useAppointments();

  const handleCancel = async () => {
    await updateAppointmentStatus(appointmentId, {
      status,
      details: cancelReason,
    });
    setIsDialogOpen(false);
  };

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
              Tem certeza de que deseja cancelar este agendamento?
            </DialogDescription>
            <Input
              type="text"
              placeholder="Digite o motivo do cancelamento"
              className="mt-2"
              onChange={(e) => {
                setCancelReason(e.target.value);
              }}
            />
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RemoveAppointment;
