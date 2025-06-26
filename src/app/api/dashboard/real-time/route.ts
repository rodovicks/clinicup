import { NextResponse } from 'next/server';
import { getDashboardRealTime } from '@/services/api-dashboard-realtime-service';
import type { RealTimeDashboardResponse } from '@/services/api-dashboard-realtime-service';

export async function GET(
  request: Request
): Promise<NextResponse<RealTimeDashboardResponse | { message: string }>> {
  const { searchParams } = new URL(request.url);
  const examTypeIds = searchParams.get('examTypeIds')?.split(',') || [];

  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    const data = await getDashboardRealTime(examTypeIds);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || 'Erro ao buscar dados do dashboard',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
