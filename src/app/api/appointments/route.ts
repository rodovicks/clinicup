import { NextResponse } from 'next/server';
import {
  getAppointments,
  saveAppointment,
} from '@/services/api-appoiments-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const examsTypeId = searchParams.get('examsTypeId') || '';
  const status = searchParams.get('status') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  try {
    const data = await getAppointments(page, {
      search,
      examsTypeId,
      status,
      startDate,
      endDate,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || 'Erro ao buscar agendamentos',
      },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const created = await saveAppointment(body);
    return NextResponse.json(created);
  } catch (error: any) {
    console.error('Erro ao salvar agendamento:', error);
    return NextResponse.json(
      {
        message: error?.response?.data?.message || 'Erro ao salvar agendamento',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
