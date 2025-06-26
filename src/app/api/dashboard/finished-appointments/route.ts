import { NextResponse } from 'next/server';
import { getFinishedAppointments } from '@/services/api-dashboard-realtime-service';
import type { FinishedAppointmentsResponse } from '@/services/api-dashboard-realtime-service';

export async function GET(): Promise<
  NextResponse<FinishedAppointmentsResponse | { message: string }>
> {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    const data = await getFinishedAppointments();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erro ao buscar atendimentos finalizados:', error);
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message ||
          'Erro ao buscar atendimentos finalizados',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
