import { NextResponse } from 'next/server';
import { updateAppointmentStatus } from '@/services/api-appoiments-service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { message: 'Status é obrigatório' },
        { status: 400 }
      );
    }

    const updated = await updateAppointmentStatus(id, { status });
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Erro ao atualizar status do agendamento:', error);
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message ||
          'Erro ao atualizar status do agendamento',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
