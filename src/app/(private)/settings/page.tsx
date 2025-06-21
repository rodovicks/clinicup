'use client';

import Link from 'next/link';
import { ContentLayout } from '@/components/template/content-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { SessionProvider } from 'next-auth/react';

const schema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email().required('Email é obrigatória'),
  maxWaitTimeMin: yup.number().required('Tempo máximo de espera é obrigatório'),
});

type FormData = {
  name: string;
  email: string;
  maxWaitTimeMin: 0;
};

export default function SettingsPage() {
  const methods = useForm<FormData>({
    resolver: yupResolver(schema as yup.ObjectSchema<FormData>),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      email: '',
      maxWaitTimeMin: 0,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log('Form data submitted:', data);
  };

  return (
    <SessionProvider>
      <ContentLayout title="Configurações">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/home">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Configurações</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <FormProvider {...methods}>
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 py-4"
          >
            <h2>Configurações</h2>
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
              <Label htmlFor="email" className="font-medium">
                Email
              </Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="font-medium">
                Novo email
              </Label>
              <div className="flex items-center gap-2">
                <Input id="email" type="email" {...register('email')} />
                <Button type="button" variant={'primary'}>
                  Alterar e-mail
                </Button>
              </div>
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="maxWaitTimeMin" className="font-medium">
                Tempo Máximo de Espera (minutos)
              </Label>
              <Input
                id="maxWaitTimeMin"
                type="number"
                {...register('maxWaitTimeMin')}
              />
              {errors.maxWaitTimeMin && (
                <span className="text-red-500 text-sm">
                  {errors.maxWaitTimeMin.message}
                </span>
              )}
            </div>
            <Button type="button" variant={'primary'}>
              Alterar senha
            </Button>
          </form>
        </FormProvider>
      </ContentLayout>
    </SessionProvider>
  );
}
