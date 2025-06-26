import { NextResponse } from 'next/server';
import { getWaitingQueue } from '@/services/api-dashboard-realtime-service';
import type { WaitingQueueResponse } from '@/services/api-dashboard-realtime-service';

export async function GET(): Promise<
  NextResponse<WaitingQueueResponse | { message: string }>
> {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    const data = await getWaitingQueue();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erro ao buscar fila de espera:', error);
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || 'Erro ao buscar fila de espera',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
