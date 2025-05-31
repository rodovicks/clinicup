import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
  { path: '/login', whenAuthenticated: 'redirect' },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login';

function isTokenExpiredFromExpiresOn(expiresOn: string | undefined): boolean {
  if (!expiresOn) return true;
  const now = Math.floor(Date.now() / 1000);
  return Number(expiresOn) < now;
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const authToken = request.cookies.get('token');
  const expiresOn = request.cookies.get('expiresOn');
  const publicRoute = publicRoutes.find((route) => route.path === path);

  // Rota pública e não autenticado: segue
  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  // Rota protegida e não autenticado: redireciona
  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  // Rota pública mas usuário autenticado deve ser redirecionado
  if (authToken && publicRoute?.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  // Redireciona de "/" para "/dashboard" se autenticado
  if (authToken && path === '/') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  // Rota protegida e autenticado: verifica expiração
  if (authToken && !publicRoute) {
    if (isTokenExpiredFromExpiresOn(expiresOn?.value)) {
      const response = NextResponse.redirect(
        new URL(REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE, request.url)
      );
      response.cookies.set('token', '', { maxAge: 0 });
      response.cookies.set('expiresOn', '', { maxAge: 0 });
      return response;
    }
    return NextResponse.next();
  }

  // Default
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
