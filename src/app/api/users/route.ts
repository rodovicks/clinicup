import { NextResponse } from 'next/server';
import { getUsers, saveUser, updateUser } from '@/services/api-users-service';
import { handleFormData } from './utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;

  try {
    const data = await getUsers(page);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.response?.data?.message || 'Erro ao buscar usuários' },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { apiFormData } = await handleFormData(request);
    const created = await saveUser(apiFormData);
    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.response?.data?.message || 'Erro ao salvar usuário' },
      { status: error?.response?.status || 500 }
    );
  }
}
