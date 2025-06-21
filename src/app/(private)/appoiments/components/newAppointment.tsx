'use client';
import { Button } from '@/components/ui/button';
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
import { Label } from '@/components/ui/label';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useAppointments } from '@/contexts/appoiments-context';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useSession } from 'next-auth/react';

const schema = yup.object().shape({
  patient_name: yup.string().required('Nome do paciente é obrigatório'),
  patient_cpf: yup
    .string()
    .required('CPF é obrigatório')
    .matches(/^\d{11}$/, 'CPF deve conter 11 dígitos'),
  patient_email: yup
    .string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  date: yup.string().required('Data do agendamento é obrigatória'),
});

type FormData = {
  patient_name: string;
  patient_cpf: string;
  patient_email: string;
  patient_phone: string;
  patient_birth_date: string;
  userId: string;
  examsTypeId: string;
  date: string;
  status: 'SCHEDULED';
  details: string;
};

export const NewAppointment = React.memo(function NewAppointment() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [examTypes, setExamTypes] = useState<
    Array<{ id: string; name: string; defaultDuration?: number }>
  >([]);
  const [examDuration, setExamDuration] = useState<number | null>(null);

  const { data: session } = useSession();

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
      patient_name: '',
      patient_cpf: '',
      patient_email: '',
      patient_phone: '',
      patient_birth_date: '',
      userId: '',
      examsTypeId: '',
      date: '',
      status: 'SCHEDULED',
      details: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { saveAppointment } = useAppointments();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    data.userId = session?.user?.id || '';
    await saveAppointment(data);
    setIsDialogOpen(false);
  };

  const handleClose = () => {
    methods.reset();
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <FormProvider {...methods}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cadastro de Agendamento</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para cadastrar um novo agendamento.
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
              <Label htmlFor="patient_cpf" className="font-medium">
                CPF
              </Label>
              <Input id="patient_cpf" {...register('patient_cpf')} />
              {errors.patient_cpf && (
                <span className="text-red-500 text-sm">
                  {errors.patient_cpf.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="patient_email" className="font-medium">
                E-mail
              </Label>
              <Input id="patient_email" {...register('patient_email')} />
              {errors.patient_email && (
                <span className="text-red-500 text-sm">
                  {errors.patient_email.message}
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
                onChange={(e) => {
                  const selectedExam = examTypes.find(
                    (exam) => exam.id === e.target.value
                  );
                  setExamDuration(selectedExam?.defaultDuration || null);
                }}
              >
                <option value="">Selecione um tipo de exame</option>
                {examTypes.map((exam) => (
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="date" className="font-medium">
                Data do Agendamento
              </Label>
              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="font-medium">
                  Data do Agendamento
                </Label>
                <Input id="date" type="datetime-local" {...register('date')} />
                {examDuration && (
                  <span className="text-gray-500 text-sm">
                    Duração estimada: {examDuration} minutos
                  </span>
                )}
              </div>
              {errors.date && (
                <span className="text-red-500 text-sm">
                  {errors.date.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="details" className="font-medium">
                Detalhes
              </Label>
              <Input id="details" {...register('details')} />
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
});
