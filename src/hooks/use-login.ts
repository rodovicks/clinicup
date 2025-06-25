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

        // Tratamento para erros conhecidos da API
        if (
          errorMessage.includes('E-mail ou senha inválidos') ||
          errorMessage.includes('Senha inválida') ||
          errorMessage.includes('Usuário não encontrado')
        ) {
          toast.error(errorMessage);
          return { success: false, error: errorMessage };
        }

        // Tratamento para erros internos / genéricos
        if (errorMessage.includes('Configuration')) {
          errorMessage = 'Erro de configuração do login';
        } else if (errorMessage.includes('CredentialsSignin')) {
          errorMessage = 'Usuário ou senha incorretos';
        } else if (errorMessage.includes('fetch')) {
          errorMessage = 'Erro de conexão com o servidor';
        } else if (errorMessage.includes('JSON')) {
          errorMessage = 'Erro na resposta do servidor';
        }

        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (result?.ok) {
        toast.success('Login realizado com sucesso');
        return { success: true };
      }

      const fallbackError = 'Falha na autenticação';
      toast.error(fallbackError);
      return { success: false, error: fallbackError };
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
