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
import { Trash } from 'lucide-react';

const RemoveAppointment = ({ appointmentId }: { appointmentId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { deleteAppointment } = useAppointments();

  const handleDelete = async () => {
    await deleteAppointment(appointmentId);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button
            className="text-red-500 hover:text-red-700"
            aria-label="Delete"
          >
            <Trash size={16} />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir este agendamento? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RemoveAppointment;
