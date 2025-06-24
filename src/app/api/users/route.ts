import { NextResponse } from 'next/server';
import { getUsers, saveUser, updateUser } from '@/services/api-users-service';

export async function handleFormData(request: Request) {
  const formData = await request.formData();

  const photo = formData.get('photo') as File | null;
  const userData = formData.get('userData');

  if (typeof userData !== 'string') {
    throw new Error('Invalid user data format');
  }

  const parsed = JSON.parse(userData);

  const apiFormData = new FormData();

  if (photo && photo.size > 0) {
    apiFormData.append('file', photo);
  }

  Object.entries(parsed).forEach(([key, value]) => {
    apiFormData.append(key, String(value));
  });

  return { apiFormData };
}

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
