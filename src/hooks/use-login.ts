import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface LoginResponse {
  success: boolean;
  error?: string;
}

export function useLogin() {
  const [loading, setLoading] = useState(false);

  async function login(
    email: string,
    password: string
  ): Promise<LoginResponse> {
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        let errorMessage = result.error;

        if (result.error.includes('fetch')) {
          errorMessage = 'Erro de conexão com o servidor';
        } else if (result.error.includes('JSON')) {
          errorMessage = 'Erro na resposta do servidor';
        }

        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (result?.ok) {
        toast.success('Login realizado com sucesso');
        return { success: true };
      }

      const errorMessage = 'Falha na autenticação';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } catch (error: any) {
      console.error('Erro no hook de login:', error);
      const errorMessage = error.message || 'Erro interno durante o login';
      toast.error('Erro ao fazer login: ' + errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }

  return { login, loading };
}
