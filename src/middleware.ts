import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isPublicRoute = [
    '/api',
    '/register',
    '/set-password',
    '/reset-password',
    '/verify-code',
    '/schedule',
    '/confirmation',
  ].some((route) => request.nextUrl.pathname.startsWith(route));

  if (!isPublicRoute && !session && request.nextUrl.pathname !== '/login') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  const path = request.nextUrl.pathname;

  if (session?.user?.tempPassword && path !== '/change-password') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/change-password';
    return NextResponse.redirect(redirectUrl);
  }

  if (session && path === '/') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/home';
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$|register|set-password|reset-password|verify-code|schedule|confirmation).*)',
  ],
};
