import { NextResponse } from 'next/server';
import {
  updateExamType,
  deleteExamType,
} from '@/services/api-exams-type-service';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const body = await request.json();
    const updated = await updateExamType(id, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(`Erro ao atualizar tipo de exame ${id}:`, error);
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || 'Erro ao atualizar tipo de exame',
      },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    await deleteExamType(id);
    return NextResponse.json({ message: 'Excluído com sucesso' });
  } catch (error: any) {
    console.error(`Erro ao excluir tipo de exame ${id}:`, error);
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || 'Erro ao excluir tipo de exame',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
