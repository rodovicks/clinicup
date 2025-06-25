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
import React from 'react';
import { useSession } from 'next-auth/react';

const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após 3 dígitos
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após 3 dígitos
    .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca hífen entre os dois últimos
    .replace(/(-\d{2})\d+?$/, '$1'); // Remove dígitos excedentes
};

const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .slice(0, 11) // Limita a 11 dígitos
    .replace(/(\d{2})(\d)/, '($1) $2') // Coloca parênteses em torno dos dois primeiros dígitos
    .replace(/(\d{5})(\d)/, '$1-$2'); // Coloca hífen entre os dois últimos
};

const schema = yup.object().shape({
  patient_name: yup.string().required('Nome do paciente é obrigatório'),
  patient_cpf: yup.string().required('CPF é obrigatório'),
  patient_email: yup
    .string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  patient_phone: yup.string().required('Telefone é obrigatório'),
  patient_birth_date: yup.string().required('Data de nascimento é obrigatória'),
  examsTypeId: yup.string().required('Tipo de exame é obrigatório'),
  date_start: yup.string().required('Data do agendamento é obrigatória'),
  date_end: yup.string().required('Data do agendamento é obrigatória'),
});

type FormData = {
  patient_name: string;
  patient_cpf: string;
  patient_email: string;
  patient_phone: string;
  patient_birth_date: string;
  userId: string;
  examsTypeId: string;
  date_start: string;
  date_end: string;
  status: 'SCHEDULED';
  details: string;
};

interface AppointmentProps {
  examTypes: Array<{ id: string; name: string; defaultDuration?: number }>;
}

export const NewAppointment = React.memo(function NewAppointment({
  examTypes,
}: AppointmentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [examDuration, setExamDuration] = useState<number | null>(null);

  const { data: session } = useSession();

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
      date_start: '',
      date_end: '',
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
    setIsLoading(true);
    try {
      data.userId = session?.user?.id || '';
      data.status = 'SCHEDULED';
      data.date_start = new Date(data.date_start).toISOString();
      data.date_end = new Date(data.date_end).toISOString();
      await saveAppointment(data);
      setIsDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    methods.reset();
    setIsDialogOpen(!isDialogOpen);
  };

  useEffect(() => {
    if (isDialogOpen === false) {
      setExamDuration(null);
      return;
    }
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <FormProvider {...methods}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Cadastro de Agendamento</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para cadastrar um novo agendamento.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-6 py-4"
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
              <Input
                id="patient_cpf"
                {...register('patient_cpf')}
                onChange={(e) =>
                  methods.setValue('patient_cpf', maskCPF(e.target.value))
                }
              />
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
              <Label htmlFor="patient_phone" className="font-medium">
                Telefone
              </Label>
              <Input
                id="patient_phone"
                {...register('patient_phone')}
                onChange={(e) =>
                  methods.setValue('patient_phone', maskPhone(e.target.value))
                }
              />
              {errors.patient_phone && (
                <span className="text-red-500 text-sm">
                  {errors.patient_phone.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="date_start" className="font-medium">
                Data e Hora de Início
              </Label>
              <Input
                id="date_start"
                type="datetime-local"
                {...register('date_start')}
                onChange={(e) => {
                  methods.setValue('date_start', e.target.value);
                  if (examDuration && e.target.value) {
                    // Adicionar minutos diretamente ao horário de início
                    const startDateTime = new Date(e.target.value);
                    const endDateTime = new Date(
                      startDateTime.getTime() + examDuration * 60000
                    );

                    // Formatar para datetime-local
                    const year = endDateTime.getFullYear();
                    const month = String(endDateTime.getMonth() + 1).padStart(
                      2,
                      '0'
                    );
                    const day = String(endDateTime.getDate()).padStart(2, '0');
                    const hours = String(endDateTime.getHours()).padStart(
                      2,
                      '0'
                    );
                    const minutes = String(endDateTime.getMinutes()).padStart(
                      2,
                      '0'
                    );

                    const formattedEndDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
                    methods.setValue('date_end', formattedEndDateTime);
                  }
                }}
              />
              {errors.date_start && (
                <span className="text-red-500 text-sm">
                  {errors.date_start.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="date_end" className="font-medium">
                Data e Hora de Término
              </Label>
              <Input
                id="date_end"
                type="datetime-local"
                {...register('date_end')}
              />
              {errors.date_end && (
                <span className="text-red-500 text-sm">
                  {errors.date_end.message}
                </span>
              )}
              {examDuration && (
                <span className="text-gray-500 text-sm">
                  Duração estimada: {examDuration} minutos
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
              <Button variant={'primary'} type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
});
