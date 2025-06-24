import { NextResponse } from 'next/server';
import { requestPasswordResetToken } from '@/services/api-change-password-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await requestPasswordResetToken(body);
    return NextResponse.json({ message: 'Token enviado para seu email' });
  } catch (error: any) {
    console.error('Erro ao solicitar token:', error);
    return NextResponse.json(
      {
        message: error?.response?.data?.message || 'Erro ao solicitar token',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
