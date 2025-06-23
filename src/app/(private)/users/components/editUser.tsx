'use client';
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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Upload from '@/components/ui/upload';
import {
  useForm,
  SubmitHandler,
  FormProvider,
  Controller,
} from 'react-hook-form';
import { useUsers } from '@/contexts/users-context';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit } from 'lucide-react';

const schema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  active: yup.boolean(),
  birth_date: yup.string().required('Data de nascimento é obrigatória'),
});

type FormData = {
  name: string;
  email: string;
  active: boolean;
  role: string;
  photo?: string;
  birth_date: string | Date;
};

export function EditUser({ user }: { user: any }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const methods = useForm<FormData>({
    resolver: yupResolver(schema as yup.ObjectSchema<FormData>),
    mode: 'onSubmit',
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      active: user?.active || true,
      photo: user?.photo || '',
      role: user?.role || 'SECRETARIA',
      birth_date: user?.birth_date || '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { updateUser } = useUsers();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const formData = new FormData();

    const userData = {
      name: data.name,
      email: data.email,
      birth_date: data.birth_date,
      active: data.active,
      role: data.role,
    };
    formData.append('userData', JSON.stringify(userData));

    const fileInput = document.getElementById('photo') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      formData.append('photo', file);
    }

    await updateUser(user.id, formData);
    setIsDialogOpen(false);
  };

  const handleClose = () => {
    methods.reset();
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <button className="text-sky-500 hover:text-sky-700" aria-label="Edit">
          <Edit size={16} />
        </button>
      </DialogTrigger>
      <FormProvider {...methods}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize os campos abaixo para editar o usuário.
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
            <div className="flex items-center gap-2">
              <Controller
                name="active"
                control={methods.control}
                defaultValue={user?.active ?? true}
                render={({ field }) => (
                  <Checkbox
                    id="active"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                )}
              />
              <Label htmlFor="active" className="font-medium">
                Ativo
              </Label>
            </div>

            <DialogFooter>
              <Button variant={'primary'} type="submit">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
