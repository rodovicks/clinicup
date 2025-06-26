import { NextResponse } from 'next/server';
import { updateUser, deleteUser, getUser } from '@/services/api-users-service';
import { handleFormData } from '../utils';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const user = await getUser(id);
    return NextResponse.json(user);
  } catch (error: any) {
    console.error(`Erro ao buscar usuário ${id}:`, error);
    return NextResponse.json(
      { message: error?.response?.data?.message || 'Erro ao buscar usuário' },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const { apiFormData } = await handleFormData(request);
    const updated = await updateUser(id, apiFormData);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(`Erro ao atualizar usuário ${id}:`, error);
    return NextResponse.json(
      {
        message: error?.response?.data?.message || 'Erro ao atualizar usuário',
      },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    await deleteUser(id);
    return NextResponse.json({ message: 'Excluído com sucesso' });
  } catch (error: any) {
    console.error(`Erro ao excluir usuário ${id}:`, error);
    return NextResponse.json(
      { message: error?.response?.data?.message || 'Erro ao excluir usuário' },
      { status: error?.response?.status || 500 }
    );
  }
}
