'use server';

import { auth } from '@/auth';
import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';

const secret = process.env.NEXTAUTH_SECRET;

export const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => {
      return `${cookie.name}=${cookie.value}`;
    })
    .join('; ');
  const token = await getToken({
    req: {
      headers: {
        cookie: cookieHeader,
      },
    } as any,
    secret,
  });

  if (!token) throw new Error('Usuário não autenticado');

  return {
    Authorization: `Bearer ${token?.accessToken}`,
    'Content-Type': 'application/json',
  };
};

export const sessionAuth = async () => {
  const sessionData = await auth();
  return sessionData;
};
