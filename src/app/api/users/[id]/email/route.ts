import { updateUserEmail } from '@/services/api-users-service';
import { NextResponse } from 'next/server';

interface Params {
  params: { id: string };
}
export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const body = await request.json();
    const created = await updateUserEmail(id, body);
    return NextResponse.json(created);
  } catch (error: any) {
    console.error('Erro ao alterar e-mail do usuário:', error);
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || 'Erro ao alterar e-mail do usuário',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
