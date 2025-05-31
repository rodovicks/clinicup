'use client';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Upload from '@/components/ui/upload';

import { useForm, SubmitHandler, Form, FormProvider } from 'react-hook-form';
import { useUsers } from '@/hooks/use-users';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Checkbox } from '@/components/ui/checkbox';

const schema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  password: yup.string().when([], (password, schema, { context }) => {
    console;
    if (context?.mode === 'create') {
      console.log('Validando senha');
      return schema
        .required('Senha é obrigatória')
        .min(6, 'A senha deve ter pelo menos 6 caracteres')
        .matches(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
        .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
        .matches(/\d/, 'A senha deve conter pelo menos um número')
        .matches(
          /[^a-zA-Z0-9]/,
          'A senha deve conter pelo menos um caractere especial'
        );
    }
    return schema.notRequired();
  }),
});

type FormData = {
  name: string;
  email: string;
  password?: string;
  active: boolean;
  role: string;
  photo?: string;
};

export function NewUser({
  user,
  mode,
  onSave,
  onClose,
}: {
  user?: any;
  mode: 'create' | 'edit';
  onSave?: (data: FormData) => void;
  onClose?: () => void;
}) {
  const methods = useForm<FormData>({
    resolver: yupResolver(schema as yup.ObjectSchema<FormData>, {
      context: { mode },
    }),
    mode: 'onChange',
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      active: user?.active || true,
      photo: user?.photo || '',
      password: '',
      role: 'SECRETARIA',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { saveUser, fetchUsers } = useUsers();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (onSave) {
      await onSave(data);
    } else {
      await saveUser(data);
    }
    fetchUsers();
    methods.reset();
    if (onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Cadastro de Usuário' : 'Editar Usuário'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Preencha os campos abaixo para cadastrar um novo usuário.'
              : 'Atualize os campos abaixo para editar o usuário.'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 py-4"
        >
          <Upload methods={methods} />
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
              E-mail
            </Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          {mode === 'create' && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="font-medium">
                Senha
              </Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Checkbox
              name="active"
              id="active"
              defaultChecked={user?.active ?? true}
            />
            <Label htmlFor="active" className="font-medium">
              Ativo
            </Label>
          </div>

          <DialogFooter>
            <Button type="submit">
              {mode === 'create' ? 'Salvar' : 'Atualizar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </FormProvider>
  );
}
