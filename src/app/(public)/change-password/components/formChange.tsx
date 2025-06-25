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
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const schema = yup.object().shape({
  token: yup.string().required('Token é obrigatório'),
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

export default function FormChangePassword() {
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [state, setState] = useState<any>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const router = useRouter();
  const { data: session } = useSession();

  interface ChangePasswordFormInputs {
    token: string;
    password: string;
    confirmPassword: string;
  }

  const onSubmit = async (data: ChangePasswordFormInputs) => {
    setLoading(true);
    try {
      if (!session?.user?.email) {
        toast.error('Email não identificado.');
        return;
      }

      await axios.post('/api/change-password', {
        email: session.user.email,
        token: data.token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      toast.success(
        'Senha alterada com sucesso. Você será redirecionado para o login.'
      );

      await signOut({ redirect: false });
      router.push('/login');
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      toast.error(error.response?.data?.message || 'Erro ao alterar a senha.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSubmit = (data: ChangePasswordFormInputs) => {
    setConfirmDialogOpen(true);
    setState(data);
  };

  const handleDialogConfirm = async () => {
    setConfirmDialogOpen(false);
    await onSubmit(state);
  };

  useEffect(() => {
    const requestToken = async () => {
      if (!session?.user?.email) {
        return;
      }
      try {
        await axios.post('/api/request-password-reset', {
          email: session.user.email,
        });
        toast.success('Token enviado para seu email.');
      } catch (error: any) {
        console.error('Erro ao solicitar token:', error);
        toast.error(
          error.response?.data?.message || 'Erro ao solicitar token.'
        );
      }
    };
    requestToken();
  }, [session?.user?.email]);

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
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={session?.user?.email || ''}
              disabled
              className="mt-1 w-full bg-gray-100"
            />
          </div>
          <div>
            <Label
              htmlFor="token"
              className="block text-sm font-medium text-gray-700"
            >
              Token
            </Label>
            <Input
              id="token"
              type="text"
              placeholder="Digite o token recebido"
              className={`mt-1 w-full ${errors.token ? 'border-red-500' : ''}`}
              {...register('token')}
            />
            {errors.token && (
              <p className="text-xs text-red-500 mt-1">
                {errors.token.message}
              </p>
            )}
          </div>
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

          <div className="flex gap-2">
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              disabled={loading}
              onClick={() => router.push('/settings')}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              className="w-full"
              disabled={loading}
              onClick={handleSubmit(handleConfirmSubmit)}
            >
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </div>
        </form>
      </Card>
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle className="text-lg font-semibold">
            Confirmar alteração de senha
          </DialogTitle>
          <div className="flex flex-col gap-4">
            <p>
              Tem certeza que deseja alterar a senha? Você será deslogado do
              sistema após a alteração.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleDialogConfirm}>
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
