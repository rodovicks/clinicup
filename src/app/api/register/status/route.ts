import { getSetupStatus } from '@/services/api-register-service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await getSetupStatus();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erro ao buscar status:', error);
    return NextResponse.json(
      { message: error?.response?.data?.message || 'Erro ao buscar status' },
      { status: error?.response?.status || 500 }
    );
  }
}
