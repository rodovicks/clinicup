'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const schema = yup.object().shape({
  maxWaitTimeMin: yup
    .number()
    .required('Tempo máximo de espera é obrigatório')
    .typeError('Informe um número válido')
    .min(1, 'Tempo máximo de espera deve ser maior que 0'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
});

type FormData = {
  name: string;
  email: string;
  maxWaitTimeMin: 0;
};
function FormConfig() {
  const { data: session } = useSession();

  const [maxWaitTimeMin, setMaxWaitTimeMin] = useState(0);
  const [email, setEmail] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [state, setState] = useState({
    name: '',
    email: '',
  });

  const methods = useForm<FormData>({
    resolver: yupResolver(schema as yup.ObjectSchema<FormData>),
    mode: 'onChange',
    defaultValues: {
      maxWaitTimeMin: 0,
    },
  });

  const {
    register,
    trigger,
    formState: { errors },
  } = methods;

  const getMaxWaitTimeMin = async () => {
    try {
      const response = await axios.get('/api/register/time');
      setMaxWaitTimeMin(response.data.maxWaitTimeMin);
      methods.setValue('maxWaitTimeMin', response.data.maxWaitTimeMin);
    } catch (error) {
      console.error('Erro ao buscar tempo máximo de espera:', error);
      toast.error('Erro ao buscar tempo máximo de espera');
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast.error('O código deve ter 6 dígitos');
      return;
    }

    try {
      await axios.post(
        `/api/users/${session?.user?.id ?? ''}/confirm-email-change`,
        {
          code: verificationCode,
        }
      );
      toast.success('E-mail alterado com sucesso!');
      setIsModalOpen(false);
      setVerificationCode('');
      getUserData();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Código de verificação inválido'
      );
    }
  };

  const handleSaveMaxWaitTime = async () => {
    try {
      if (maxWaitTimeMin <= 0) {
        toast.error('O tempo máximo de espera deve ser maior que 0.');
        return;
      }
      await axios.put('/api/register/time', maxWaitTimeMin);
      getMaxWaitTimeMin();
      toast.success('Tempo máximo de espera salvo com sucesso!');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Erro ao salvar tempo máximo de espera'
      );
    }
  };

  const handleSaveEmail = async () => {
    try {
      const validate = await trigger('email');
      if (!validate) {
        toast.error('Por favor, corrija os erros antes de salvar.');
        return;
      }
      await axios.post(`/api/users/${session?.user?.id ?? ''}/email`, {
        email: email,
      });
      toast.success(
        'Uma mensagem de confirmação foi enviada para o novo e-mail.'
      );
      setIsModalOpen(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Erro ao salvar tempo máximo de espera'
      );
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.get(`/api/users/${session?.user?.id}`);
      const userData = response.data;
      setState({
        name: userData.name || '',
        email: userData.email || '',
      });
    } catch (error: any) {
      toast.error('Erro ao carregar dados do usuário');
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      getMaxWaitTimeMin();
      getUserData();
    }
  }, [session?.user?.id]);

  return (
    <FormProvider {...methods}>
      <form noValidate className="flex flex-col gap-6 py-4">
        <h2>Configurações</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="font-medium">
            Nome
          </Label>
          <Input id="name" disabled value={state?.name} />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="font-medium">
            Email
          </Label>
          <Input id="email" type="email" disabled value={state?.email} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="font-medium">
            Alterar email principal
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="email"
              type="email"
              {...register('email', {
                onChange: (e) => {
                  trigger('email');
                  setEmail(e.target.value);
                },
              })}
            />
            <Button type="button" variant={'primary'} onClick={handleSaveEmail}>
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
            <div className="flex flex-col gap-2">
              <div className="flex gap-4">
                <Input
                  id="maxWaitTimeMin"
                  type="number"
                  defaultValue={maxWaitTimeMin}
                  {...register('maxWaitTimeMin', {
                    onChange: (e) => {
                      trigger('maxWaitTimeMin');
                      setMaxWaitTimeMin(Number(e.target.value));
                    },
                  })}
                />
                <Button
                  type="button"
                  onClick={handleSaveMaxWaitTime}
                  variant={'primary'}
                >
                  Salvar
                </Button>
              </div>
              {errors.maxWaitTimeMin && (
                <span className="text-red-500 text-sm">
                  {errors.maxWaitTimeMin.message}
                </span>
              )}
            </div>
          </div>
        )}
      </form>
      <div className="flex mt-4">
        <Button
          type="button"
          variant="primary"
          onClick={() => {
            window.location.href = '/change-password';
          }}
        >
          Alterar Senha
        </Button>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle className="text-lg font-semibold">
            Confirmação de Código
          </DialogTitle>
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Um código foi enviado para o e-mail alterado. Por favor,
                verifique sua caixa de entrada e insira o código para confirmar.
              </p>
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Código de verificação</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setVerificationCode(value);
                  }}
                  placeholder="Digite o código de 6 dígitos"
                  className="w-full"
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setVerificationCode('');
                }}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleVerifyCode}
                variant="primary"
                disabled={!verificationCode}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}

export default React.memo(FormConfig);
