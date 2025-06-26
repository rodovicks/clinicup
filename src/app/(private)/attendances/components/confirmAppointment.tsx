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
import { useForm, SubmitHandler, FormProvider, set } from 'react-hook-form';
import { useAppointments } from '@/contexts/appoiments-context';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Appointment } from '@/contexts/appoiments-context';

type FormData = Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>;

const schema = yup.object().shape({
  patient_name: yup.string().required('Nome do paciente é obrigatório'),
  patient_email: yup
    .string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  patient_cpf: yup.string().required('CPF é obrigatório'),
  patient_phone: yup.string().required('Telefone é obrigatório'),
  patient_birth_date: yup.string().required('Data de nascimento é obrigatória'),
  date_start: yup.string().required('Data de início é obrigatória'),
  date_end: yup.string().required('Data de término é obrigatória'),
  examsTypeId: yup.string().required('Tipo de exame é obrigatório'),
});

const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
};

interface AppointmentProps {
  examTypes: Array<{ id: string; name: string; defaultDuration?: number }>;
}

export function ConfirmAppointment({
  appointment,
  examTypes,
}: {
  appointment: Required<Pick<Appointment, 'id'>> & Appointment;
  examTypes: AppointmentProps['examTypes'];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [examDuration, setExamDuration] = useState<number | null>(null);

  const methods = useForm<FormData>({
    resolver: yupResolver(schema as yup.ObjectSchema<FormData>),
    mode: 'onSubmit',
    defaultValues: {
      patient_name: appointment?.patient_name || '',
      patient_email: appointment?.patient_email || '',
      date_start: appointment?.date_start
        ? new Date(appointment.date_start)
            .toLocaleString('sv-SE', {
              timeZone: 'America/Sao_Paulo',
            })
            .replace(' ', 'T')
        : '',
      date_end: appointment?.date_end
        ? new Date(appointment.date_end)
            .toLocaleString('sv-SE', {
              timeZone: 'America/Sao_Paulo',
            })
            .replace(' ', 'T')
        : '',
      patient_cpf: appointment?.patient_cpf || '',
      patient_phone: appointment?.patient_phone || '',
      patient_birth_date: appointment?.patient_birth_date || '',
      userId: appointment?.userId || '',
      examsTypeId: appointment?.examsTypeId || '',
      status: appointment?.status || 'WAITING_APPOIMENT',
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
    if (!appointment.id) return;
    setIsLoading(true);
    data.date_start = new Date(data.date_start).toISOString();
    data.date_end = new Date(data.date_end).toISOString();
    try {
      await updateAppointment(appointment.id, {
        ...data,
        status: appointment.status || 'WAITING_APPOIMENT',
      });
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
    }

    const defaultExamTypes = examTypes.find(
      (exam) => exam.id === methods.getValues('examsTypeId')
    );

    setExamDuration(defaultExamTypes?.defaultDuration || null);
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="primary">Chamar próximo agendamento</Button>
      </DialogTrigger>
      <FormProvider {...methods}>
        <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Confirmação de Agendamento</DialogTitle>
            <DialogDescription>
              Confirme os campos abaixo para confirmar o agendamento.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4"
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
                  methods.setValue('examsTypeId', e.target.value);
                }}
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
                defaultValue={
                  appointment?.date_start
                    ? new Date(appointment.date_start)
                        .toISOString()
                        .slice(0, 16)
                    : ''
                }
                onChange={(e) => {
                  methods.setValue('date_start', e.target.value);

                  const currentExamType = examTypes.find(
                    (exam) => exam.id === methods.getValues('examsTypeId')
                  );
                  const examDuration = currentExamType?.defaultDuration;

                  if (examDuration && e.target.value) {
                    const startDateTime = new Date(e.target.value);
                    const endDateTime = new Date(
                      startDateTime.getTime() + examDuration * 60000
                    );

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
                defaultValue={
                  appointment?.date_end
                    ? new Date(appointment.date_end).toISOString().slice(0, 16)
                    : ''
                }
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
            <div className="col-span-2 flex justify-end">
              <DialogFooter>
                <Button variant={'primary'} type="submit" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Confirmar dados'}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
