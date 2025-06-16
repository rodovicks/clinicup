import { NextResponse } from 'next/server';
import { getUsers, saveUser } from '@/services/api-users-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;

  try {
    const data = await getUsers(page);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json(
      { message: error?.response?.data?.message || 'Erro ao buscar usuários' },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await saveUser(body);
    return NextResponse.json(created);
  } catch (error: any) {
    console.error('Erro ao salvar usuário:', error);
    return NextResponse.json(
      { message: error?.response?.data?.message || 'Erro ao salvar usuário' },
      { status: error?.response?.status || 500 }
    );
  }
}
