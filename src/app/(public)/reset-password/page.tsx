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

const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
});

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  interface ResetPasswordFormInputs {
    email: string;
  }

  const router = useRouter();

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    try {
      console.log('Resetting password for:', data.email);
      toast.success(
        'Instruções de redefinição de senha enviadas para o email.'
      );

      router.push('/verify-code');
    } catch (error) {
      toast.error('Erro ao solicitar redefinição de senha.');
    }
  };

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
          Redefinir Senha
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

          <Button type="submit" variant="primary" className="w-full">
            Enviar
          </Button>
        </form>
      </Card>
    </div>
  );
}
