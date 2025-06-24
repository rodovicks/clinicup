import { NextResponse } from 'next/server';
import { getUsers, saveUser, updateUser } from '@/services/api-users-service';

export async function handleFormData(request: Request) {
  const formData = await request.formData();

  console.log('FormData received:', formData);

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
    console.error('Erro ao buscar usuários:', error);
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
    console.error('Erro ao salvar usuário:', error);
    return NextResponse.json(
      { message: error?.response?.data?.message || 'Erro ao salvar usuário' },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new Error('ID is required');
    }

    const { apiFormData } = await handleFormData(request);
    const updated = await updateUser(id, apiFormData);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json(
      {
        message: error?.response?.data?.message || 'Erro ao atualizar usuário',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
