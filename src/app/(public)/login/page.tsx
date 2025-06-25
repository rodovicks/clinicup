'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Activity } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLogin } from '@/hooks/use-login';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
});

import { useEffect } from 'react';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const response = await fetch('/api/register/status');
        const data = await response.json();
        if (!data?.initialized) {
          toast('Sistema não configurado, redirecionando para registro');
          setTimeout(() => {
            router.push('/register');
          }, 100);
        }
      } catch (error) {
        toast('Erro ao verificar o status de configuração.');
      }
    };

    checkSetupStatus();
  }, [router]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  interface LoginFormInputs {
    email: string;
    password: string;
  }

  const { login, loading } = useLogin();

  const onSubmit = async (data: LoginFormInputs) => {
    const result = await login(data.email, data.password);
    if (result?.success) {
      router.push('/home');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-8 w-full max-w-md shadow-md">
        <div className="flex flex-col items-center justify-center gap-4 mb-4">
          <Activity className="w-10 h-10 mr-2  text-sky-500" />

          <h1 className="text-2xl font-bold text-center text-sky-500">
            Clinic Up
          </h1>
        </div>
        <h2 className="text-lg font-semibold text-center mb-6">
          Acesse sua conta
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              className={`mt-1 w-full ${errors.email ? 'border-red-500' : ''}`}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              className={`mt-1 w-full ${
                errors.password ? 'border-red-500' : ''
              }`}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="flex gap-4 mt-4">
          <Link href="/confirmation" className="w-full">
            <Button type="button" variant="outline" className="w-full">
              Confirmar Agendamento
            </Button>
          </Link>
          <Link href="/schedule" className="w-full">
            <Button type="button" variant="outline" className="w-full">
              Fila de Agendamento
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
