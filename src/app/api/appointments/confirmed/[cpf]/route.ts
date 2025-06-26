import { NextResponse } from 'next/server';
import { confirmAppointment } from '@/services/api-appointments-confirmation-service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ cpf: string }> }
) {
  try {
    const { cpf } = await params;
    const data = await confirmAppointment(cpf);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || 'Erro ao confirmar agendamento',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
