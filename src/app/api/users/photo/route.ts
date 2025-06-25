import { getUploadPhoto } from '@/services/api-users-service';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const initialImage = searchParams.get('initialImage') || '';

    if (!initialImage.trim()) {
      return NextResponse.json(
        {
          message:
            'Não foi possível buscar a foto, imagem inicial não informada',
        },
        { status: 400 }
      );
    }

    const imageResponse = await getUploadPhoto(initialImage);

    return new NextResponse(imageResponse.data, {
      status: 200,
      headers: {
        'Content-Type': imageResponse.headers['content-type'],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.response?.data?.message || 'Erro ao buscar foto' },
      { status: error?.response?.status || 500 }
    );
  }
}
