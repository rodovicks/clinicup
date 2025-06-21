import { saveSetup } from '@/services/api-register-service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await saveSetup(body);
    return NextResponse.json(created);
  } catch (error: any) {
    console.error('Erro ao salvar usuário:', error);
    return NextResponse.json(
      { message: error?.response?.data?.message || 'Erro ao salvar usuário' },
      { status: error?.response?.status || 500 }
    );
  }
}
