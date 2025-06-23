import {
  getSetupMaxTime,
  updateSetupMaxTime,
} from '@/services/api-register-service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await getSetupMaxTime();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erro ao buscar status:', error);
    return NextResponse.json(
      { message: error?.response?.data?.message || 'Erro ao buscar status' },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const maxWaitTimeMin = await request.json();
    const data = await updateSetupMaxTime(maxWaitTimeMin);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erro ao atualizar tempo máximo de espera:', error);
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message ||
          'Erro ao atualizar tempo máximo de espera',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
