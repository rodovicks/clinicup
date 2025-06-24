import { NextResponse } from 'next/server';
import { changePassword } from '@/services/api-change-password-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await changePassword(body);
    return NextResponse.json({ message: 'Senha alterada com sucesso' });
  } catch (error: any) {
    console.error('Erro ao alterar senha:', error);
    return NextResponse.json(
      {
        message: error?.response?.data?.message || 'Erro ao alterar senha',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
