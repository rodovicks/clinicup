import { confirmEmailChange } from '@/services/api-users-service';
import { NextResponse } from 'next/server';

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const { code } = await request.json();

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { message: 'Código de verificação inválido' },
        { status: 400 }
      );
    }

    await confirmEmailChange(id, code);
    return NextResponse.json({ message: 'E-mail alterado com sucesso' });
  } catch (error: any) {
    console.error('Erro ao confirmar alteração de e-mail:', error);
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message ||
          'Erro ao confirmar alteração de e-mail',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
