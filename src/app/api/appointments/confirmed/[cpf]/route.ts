import { NextResponse } from 'next/server';
import { confirmAppointment } from '@/services/api-appointments-confirmation-service';

export async function POST(
  request: Request,
  { params }: { params: { cpf: string } }
) {
  try {
    const query = await params;
    const data = await confirmAppointment(query?.cpf);
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
