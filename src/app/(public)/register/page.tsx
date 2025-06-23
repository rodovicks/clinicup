'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Activity } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect } from 'react';

const schema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .matches(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .matches(/[0-9]/, 'A senha deve conter pelo menos um número')
    .matches(
      /[@$!%*?&]/,
      'A senha deve conter pelo menos um caractere especial'
    )
    .required('Senha é obrigatória'),
  maxWaitTimeMin: yup
    .number()
    .typeError('Informe um número')
    .min(0, 'O tempo deve ser maior ou igual a 0')
    .required('Tempo máximo de atraso é obrigatório'),
});

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const router = useRouter();

  interface SetupFormInputs {
    name: string;
    email: string;
    password: string;
    maxWaitTimeMin: number;
  }

  const onSubmit = async (data: SetupFormInputs) => {
    try {
      const response = await axios.post('/api/register', data);

      if (response.status === 200) {
        toast.success('Sistema configurado com sucesso.');
        router.push('/login');
      } else {
        toast.error('Erro ao configurar o sistema.');
      }
    } catch (error) {
      toast.error('Erro ao configurar o sistema.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/register/status');
      const data = response.data;
      if (data?.initialized === true) {
        router.push('/login');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-8 w-full max-w-md shadow-md">
        <div className="flex flex-col items-center justify-center gap-4 mb-4">
          <Activity className="w-10 h-10 mr-2 text-sky-500" />

          <h1 className="text-2xl font-bold text-center text-sky-500">
            Clinic Up
          </h1>
        </div>
        <h2 className="text-lg font-semibold text-center mb-6">
          Configuração Inicial
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              className={`mt-1 w-full ${errors.name ? 'border-red-500' : ''}`}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
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
          <div>
            <Label
              htmlFor="maxWaitTimeMin"
              className="block text-sm font-medium text-gray-700"
            >
              Tempo máximo de atraso (minutos)
            </Label>
            <Input
              id="maxWaitTimeMin"
              type="number"
              placeholder="Digite o tempo máximo de atraso"
              className={`mt-1 w-full ${
                errors.maxWaitTimeMin ? 'border-red-500' : ''
              }`}
              {...register('maxWaitTimeMin')}
            />
            {errors.maxWaitTimeMin && (
              <p className="text-xs text-red-500 mt-1">
                {errors.maxWaitTimeMin.message}
              </p>
            )}
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Configurar
          </Button>
        </form>
      </Card>
    </div>
  );
}
