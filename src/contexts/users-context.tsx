'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  active: boolean;
  role: string;
};

type UsersContextType = {
  users: User[];
  setUsers: (users: User[]) => void;
  isLoading: boolean;
  error: string | null;
};

const UsersContext = createContext<UsersContextType>({
  users: [],
  setUsers: () => {},
  isLoading: false,
  error: null,
});

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ users, setUsers, isLoading, error }}>
      {children}
    </UsersContext.Provider>
  );
}

export const useUsersContext = () => useContext(UsersContext);
