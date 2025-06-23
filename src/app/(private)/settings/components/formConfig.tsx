'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const schema = yup.object().shape({
  maxWaitTimeMin: yup.number().required('Tempo máximo de espera é obrigatório'),
});

type FormData = {
  name: string;
  email: string;
  maxWaitTimeMin: 0;
};

export default function FormConfig() {
  const { data: session } = useSession();

  const [maxWaitTimeMin, setMaxWaitTimeMin] = useState(0);

  const methods = useForm<FormData>({
    resolver: yupResolver(schema as yup.ObjectSchema<FormData>),
    mode: 'onSubmit',
    defaultValues: {
      maxWaitTimeMin: 0,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const getMaxWaitTimeMin = () => {
    const response = axios.get('/api/register/time');
    response
      .then((res) => {
        setMaxWaitTimeMin(res.data.maxWaitTimeMin);
        methods.setValue('maxWaitTimeMin', res.data.maxWaitTimeMin);
      })
      .catch((error) => {
        console.error('Erro ao buscar tempo máximo de espera:', error);
      });
  };

  const handleSaveMaxWaitTime = async () => {
    try {
      await axios.put('/api/register/time', maxWaitTimeMin);
      getMaxWaitTimeMin();
      toast.success('Tempo máximo de espera salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar o tempo máximo de espera. Tente novamente.');
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log('Form data submitted:', data);
  };

  useEffect(() => {
    getMaxWaitTimeMin();
  }, []);

  console.log('Session data:', session);

  return (
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
          <Input id="name" disabled value={session?.user?.name ?? ''} />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            disabled
            value={session?.user?.email ?? ''}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="font-medium">
            Alterar email principal
          </Label>
          <div className="flex items-center gap-4">
            <Input id="email" type="email" {...register('email')} />
            <Button type="button" variant={'primary'}>
              Alterar e-mail
            </Button>
          </div>
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
        {session?.user?.role === 'ADMIN' && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="maxWaitTimeMin" className="font-medium">
              Tempo Máximo de Espera (minutos)
            </Label>

            <div className="flex gap-4">
              <Input
                id="maxWaitTimeMin"
                type="number"
                defaultValue={maxWaitTimeMin}
                {...register('maxWaitTimeMin', {
                  onChange: (e) => {
                    setMaxWaitTimeMin(Number(e.target.value));
                  },
                })}
              />
              {errors.maxWaitTimeMin && (
                <span className="text-red-500 text-sm">
                  {errors.maxWaitTimeMin.message}
                </span>
              )}
              <Button
                type="button"
                onClick={handleSaveMaxWaitTime}
                variant={'primary'}
              >
                Salvar
              </Button>
            </div>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
