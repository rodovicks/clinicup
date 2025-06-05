import { createContext, useContext, useState } from 'react';
import {
  getUsers,
  saveUser,
  updateUser,
  deleteUser,
} from '@/services/api-users-service';
import { toast } from 'sonner';

export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  createdAt?: Date;
  photo?: string;
}

interface UsersContextType {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  loading: boolean;
  setCurrentPage: (page: number) => void;
  fetchUsers: (page?: number) => Promise<void>;
  saveUser: (user: User) => Promise<void>;
  updateUser: (id: string, user: User) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const UsersContext = createContext<UsersContextType | null>(null);

export const UsersProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (page = currentPage) => {
    setLoading(true);
    try {
      const data = await getUsers(page);
      setUsers(data.data);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (user: User) => {
    setLoading(true);
    try {
      await saveUser(user);
      toast.success('Usuário salvo com sucesso!');
      await fetchUsers(currentPage);
    } catch (error) {
      toast.error(`Erro: ${error}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id: string, user: User) => {
    setLoading(true);
    try {
      await updateUser(id, user);
      toast.success('Usuário atualizado com sucesso!');
      await fetchUsers(currentPage);
    } catch (error) {
      toast.error(`Erro: ${error}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setLoading(true);
    try {
      await deleteUser(id);
      toast.success('Usuário excluído com sucesso!');
      await fetchUsers(currentPage);
    } catch (error) {
      toast.error(`Erro: ${error}`);
      throw error;
    } finally {
      setLoading(false);
    }
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

export const useUsers = () => {
  const ctx = useContext(UsersContext);
  if (!ctx) {
    throw new Error('useUsers precisa estar dentro de <UsersProvider>');
  }
  return ctx;
};
