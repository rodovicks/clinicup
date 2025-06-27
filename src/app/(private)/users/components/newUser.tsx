'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Upload from '@/components/ui/upload';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useUsers } from '@/contexts/users-context';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  birth_date: yup.string().required('Data de nascimento é obrigatória'),
});

type FormData = {
  name: string;
  email: string;
  role: string;
  photo?: string;
  birth_date: string;
};

export function NewUser({ user }: { user?: any }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<FormData>({
    resolver: yupResolver(schema as yup.ObjectSchema<FormData>),
    mode: 'onSubmit',
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      photo: user?.photo || '',
      role: 'SECRETARIA',
      birth_date: user?.birth_date || '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { saveUser } = useUsers();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      const userData = {
        name: data.name,
        email: data.email,
        birth_date: data.birth_date,
        role: data.role,
      };
      formData.append('userData', JSON.stringify(userData));

      const fileInput = document.getElementById('photo') as HTMLInputElement;
      const file = fileInput?.files?.[0];
      if (file) {
        formData.append('photo', file);
      }

      await saveUser(formData);
      setIsDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    methods.reset();
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
          Novo Usuário
        </Button>
      </DialogTrigger>
      <FormProvider {...methods}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cadastro de Usuário</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para cadastrar um novo usuário.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 py-4"
          >
            <Upload initialImage={user?.photo} />
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="birth_date" className="font-medium">
                Data de Nascimento
              </Label>
              <Input id="birth_date" type="date" {...register('birth_date')} />
              {errors.birth_date && (
                <span className="text-red-500 text-sm">
                  {errors.birth_date.message}
                </span>
              )}
            </div>
            <DialogFooter>
              <Button variant={'primary'} type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
