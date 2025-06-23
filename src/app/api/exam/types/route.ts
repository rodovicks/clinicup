import { NextResponse } from 'next/server';
import { getExamTypes, saveExamType } from '@/services/api-exams-type-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;

  try {
    const data = await getExamTypes(page);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erro ao buscar tipos de exame:', error);
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || 'Erro ao buscar tipos de exame',
      },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await saveExamType(body);
    return NextResponse.json(created);
  } catch (error: any) {
    console.error('Erro ao salvar tipo de exame:', error);
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || 'Erro ao salvar tipo de exame',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
