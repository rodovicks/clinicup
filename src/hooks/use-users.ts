'use client';

import { useUsersContext } from '@/contexts/users-context';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

type User = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  active: boolean;
  role: string;
};

export function useUsers() {
  const { users, setUsers } = useUsersContext();

  const saveUser = async (data: User) => {
    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Ops! Ocorreu um erro ao salvar o usuário.');
      }

      const newUser = await response.json();
      setUsers([...users, newUser]);
      toast.success('Usuário salvo com sucesso!');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Ops! Ocorreu um erro ao salvar o usuário.'
      );
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ops! Ocorreu um erro ao buscar os usuários.');
      }

      const data = await response.json();
      setUsers(data?.data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Ops! Ocorreu um erro ao buscar os usuários.'
      );
    }
  };

  return { saveUser, fetchUsers, users };
}
