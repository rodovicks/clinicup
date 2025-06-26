import { NextResponse } from 'next/server';
import {
  updateAppointment,
  deleteAppointment,
} from '@/services/api-appoiments-service';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateAppointment(id, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Erro ao atualizar agendamento:', error);
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || 'Erro ao atualizar agendamento',
      },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteAppointment(id);
    return NextResponse.json({ message: 'Agendamento excluído com sucesso' });
  } catch (error: any) {
    console.error('Erro ao excluir agendamento:', error);
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || 'Erro ao excluir agendamento',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
