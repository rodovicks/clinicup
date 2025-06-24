'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
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
import {
  useForm,
  SubmitHandler,
  FormProvider,
  Controller,
} from 'react-hook-form';
import { useExamTypes } from '@/contexts/exams-context';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const schema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  description: yup.string().required('Descrição é obrigatória'),
  defaultDuration: yup
    .number()
    .required('Duração padrão é obrigatória')
    .typeError('Duração padrão deve ser um número')
    .min(1, 'Duração padrão deve ser maior que 0'),
  preparationInstruction: yup
    .string()
    .required('Instruções de preparação são obrigatórias'),
  active: yup.boolean().transform((value) => (value === 'on' ? true : false)),
});

type FormData = {
  name: string;
  description: string;
  defaultDuration: number;
  preparationInstruction: string;
  active: boolean;
};

export function NewExamType({ examType }: { examType?: any }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const methods = useForm<FormData>({
    resolver: yupResolver(schema as yup.ObjectSchema<FormData>),
    mode: 'onSubmit',
    defaultValues: {
      name: examType?.name || '',
      description: examType?.description || '',
      defaultDuration: examType?.defaultDuration || 0,
      preparationInstruction: examType?.preparationInstruction || '',
      active: examType?.active,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { saveExamType } = useExamTypes();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log('teste', data);
    await saveExamType(data);
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
          Novo Tipo de Exame
        </Button>
      </DialogTrigger>
      <FormProvider {...methods}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cadastro de Tipo de Exame</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para cadastrar um novo tipo de exame.
            </DialogDescription>
          </DialogHeader>
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 py-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="font-medium">
                Nome
              </Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="font-medium">
                Descrição
              </Label>
              <Input id="description" {...register('description')} />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="defaultDuration" className="font-medium">
                Duração Padrão (minutos)
              </Label>
              <Input
                id="defaultDuration"
                type="number"
                {...register('defaultDuration')}
              />
              {errors.defaultDuration && (
                <span className="text-red-500 text-sm">
                  {errors.defaultDuration.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="preparationInstruction" className="font-medium">
                Instruções de Preparação
              </Label>
              <Textarea
                id="preparationInstruction"
                className="resize-none"
                rows={4}
                {...register('preparationInstruction')}
              />
              {errors.preparationInstruction && (
                <span className="text-red-500 text-sm">
                  {errors.preparationInstruction.message}
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
