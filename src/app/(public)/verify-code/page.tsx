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
  code: yup
    .string()
    .length(6, 'O código deve ter 6 dígitos')
    .required('Código é obrigatório'),
});

export default function VerifyCode() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  interface VerifyCodeFormInputs {
    code: string;
  }

  const router = useRouter();

  const onSubmit = async (data: VerifyCodeFormInputs) => {
    try {
      const isValid = true;
      if (isValid) {
        toast.success('Código verificado com sucesso.');
        router.push('/set-password');
      } else {
        toast.error('Código inválido.');
      }
    } catch (error) {
      toast.error('Erro ao verificar o código.');
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
          Verificar Código
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Código
            </Label>
            <Input
              id="code"
              type="text"
              placeholder="Digite o código recebido"
              className={`mt-1 w-full ${errors.code ? 'border-red-500' : ''}`}
              {...register('code')}
            />
            {errors.code && (
              <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Verificar
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full mt-2"
            onClick={() => router.push('/reset-password')}
          >
            Voltar para inserir e-mail
          </Button>
        </form>
      </Card>
    </div>
  );
}
