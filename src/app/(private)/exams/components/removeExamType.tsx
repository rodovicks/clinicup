import React from 'react';
import { ExamType, useExamTypes } from '../../../../contexts/exams-context';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Trash } from 'lucide-react';

interface RemoveExamTypeProps {
  examType: ExamType;
}

const RemoveExamType: React.FC<RemoveExamTypeProps> = ({ examType }) => {
  const { deleteExamType } = useExamTypes();

  const handleRemove = async () => {
    await deleteExamType(examType.id ?? '');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-red-500 hover:text-red-700" aria-label="Delete">
          <Trash size={16} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Remoção</DialogTitle>
        </DialogHeader>
        <p>Tem certeza que deseja remover o tipo de exame {examType.name}?</p>
        <DialogFooter>
          <Button variant="destructive" onClick={handleRemove}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveExamType;
