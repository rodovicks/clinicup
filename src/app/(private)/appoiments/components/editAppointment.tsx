'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useAppointments } from '@/contexts/appoiments-context';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import { Edit } from 'lucide-react';

const schema = yup.object().shape({
  patient_name: yup.string().required('Nome do paciente é obrigatório'),
  patient_email: yup
    .string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  date: yup.string().required('Data é obrigatória'),
  patient_cpf: yup.string().required('CPF é obrigatório'),
  patient_phone: yup.string().required('Telefone é obrigatório'),
  patient_birth_date: yup.string().required('Data de nascimento é obrigatória'),
});

type FormData = {
  patient_name: string;
  patient_email: string;
  date: string;
  patient_cpf: string;
  patient_phone: string;
  patient_birth_date: string;
  userId: string;
  examsTypeId: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  details: string;
};

export function EditAppointment({ appointment }: { appointment: any }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [examTypes, setExamTypes] = useState([]);

  useEffect(() => {
    const fetchExamTypes = async () => {
      try {
        const response = await axios.get('/api/exam/types');
        setExamTypes(response.data.data || []);
      } catch (error) {
        console.error('Erro ao buscar tipos de exame:', error);
      }
    };
    fetchExamTypes();
  }, []);

  const methods = useForm<FormData>({
    resolver: yupResolver(schema as yup.ObjectSchema<FormData>),
    mode: 'onSubmit',
    defaultValues: {
      patient_name: appointment?.patient_name || '',
      patient_email: appointment?.patient_email || '',
      date: appointment?.date || '',
      patient_cpf: appointment?.patient_cpf || '',
      patient_phone: appointment?.patient_phone || '',
      patient_birth_date: appointment?.patient_birth_date || '',
      userId: appointment?.userId || '',
      examsTypeId: appointment?.examsTypeId || '',
      status: appointment?.status || 'SCHEDULED',
      details: appointment?.details || '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { updateAppointment } = useAppointments();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await updateAppointment(appointment.id, data);
    setIsDialogOpen(false);
  };

  const handleClose = () => {
    methods.reset();
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <button className="text-sky-500 hover:text-sky-700" aria-label="Edit">
          <Edit size={16} />
        </button>
      </DialogTrigger>
      <FormProvider {...methods}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
            <DialogDescription>
              Atualize os campos abaixo para editar o agendamento.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 py-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="patient_name" className="font-medium">
                Nome do Paciente
              </Label>
              <Input id="patient_name" {...register('patient_name')} />
              {errors.patient_name && (
                <span className="text-red-500 text-sm">
                  {errors.patient_name.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="patient_email" className="font-medium">
                E-mail do Paciente
              </Label>
              <Input
                id="patient_email"
                type="email"
                {...register('patient_email')}
              />
              {errors.patient_email && (
                <span className="text-red-500 text-sm">
                  {errors.patient_email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="date" className="font-medium">
                Data do Agendamento
              </Label>
              <Input id="date" type="datetime-local" {...register('date')} />
              {errors.date && (
                <span className="text-red-500 text-sm">
                  {errors.date.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="patient_birth_date" className="font-medium">
                Data de Nascimento
              </Label>
              <Input
                id="patient_birth_date"
                type="date"
                {...register('patient_birth_date')}
              />
              {errors.patient_birth_date && (
                <span className="text-red-500 text-sm">
                  {errors.patient_birth_date.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="examsTypeId" className="font-medium">
                Tipo de Exame
              </Label>
              <select
                id="examsTypeId"
                {...register('examsTypeId')}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="">Selecione um tipo de exame</option>
                {examTypes.map((exam: any) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>
              {errors.examsTypeId && (
                <span className="text-red-500 text-sm">
                  {errors.examsTypeId.message}
                </span>
              )}
            </div>
            <DialogFooter>
              <Button variant={'primary'} type="submit">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
