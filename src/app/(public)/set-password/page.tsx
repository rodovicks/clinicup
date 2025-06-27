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
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'As senhas não coincidem')
    .required('Confirmação de senha é obrigatória'),
});

export default function SetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  interface SetPasswordFormInputs {
    password: string;
    confirmPassword: string;
  }

  const router = useRouter();

  const onSubmit = async (data: SetPasswordFormInputs) => {
    try {
      toast.success('Senha alterada com sucesso.');
      router.push('/login');
    } catch (error) {
      toast.error('Erro ao alterar a senha.');
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
          Alterar Senha
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Nova Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua nova senha"
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
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmar Senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua nova senha"
              className={`mt-1 w-full ${
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Alterar Senha
          </Button>
        </form>
      </Card>
    </div>
  );
}
