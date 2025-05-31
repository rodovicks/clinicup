import { useState } from 'react';

interface LoginResponse {
  token?: string;
  expiresOn?: string;
  email?: string;
  name?: string;
  role?: string;
  error?: string;
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(
    email: string,
    password: string
  ): Promise<LoginResponse | null> {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Verifique o e-mail e a senha para entrar.');
      }

      const data = await response.json();
      if (data.token) {
        document.cookie = `token=${data.token};`;
        document.cookie = `expiresOn=${data.expiresOn};`;
        document.cookie = `email=${data.email};`;
        document.cookie = `name=${data.name};`;
        document.cookie = `role=${data.role};`;
      }
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Erro ao fazer login:', err);
        setError(err.message || 'Verifique o e-mail e a senha para entrar.');
      } else {
        console.error('Erro desconhecido ao fazer login:', err);
        setError('Verifique o e-mail e a senha para entrar.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { login, loading, error };
}
