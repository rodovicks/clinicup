'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt?: Date;
  photo?: string;
  birth_date?: Date | string;
}

interface UsersContextType {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  loading: boolean;
  setCurrentPage: (page: number) => void;
  fetchUsers: (page?: number) => Promise<void>;
  saveUser: (user: FormData) => Promise<void>;
  updateUser: (id: string, user: User | FormData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const UsersContext = createContext<UsersContextType | null>(null);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const withLoading = async (callback: () => Promise<void>) => {
    setLoading(true);
    try {
      await callback();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || error.message || 'Erro inesperado'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (page = currentPage) => {
    await withLoading(async () => {
      const response = await axios.get('/api/users', { params: { page } });
      const data = response.data;

      setUsers(data.data);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    });
  };

  const handleSaveUser = async (user: FormData) => {
    await withLoading(async () => {
      await axios.post('/api/users', user);
      toast.success('Usuário salvo com sucesso!');
      await fetchUsers(currentPage);
    });
  };

  const handleUpdateUser = async (id: string, user: User | FormData) => {
    await withLoading(async () => {
      await axios.put(`/api/users/${id}`, user);
      toast.success('Usuário atualizado com sucesso!');
      await fetchUsers(currentPage);
    });
  };

  const handleDeleteUser = async (id: string) => {
    await withLoading(async () => {
      await axios.delete(`/api/users/${id}`);
      toast.success('Usuário excluído com sucesso!');
      await fetchUsers(currentPage);
    });
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        currentPage,
        totalPages,
        totalItems,
        loading,
        setCurrentPage,
        fetchUsers,
        saveUser: handleSaveUser,
        updateUser: handleUpdateUser,
        deleteUser: handleDeleteUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = (): UsersContextType => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('Erro ao acessar o contexto de usuários.');
  }
  return context;
};
