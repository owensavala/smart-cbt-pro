import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'smartcbt-super-secure-jwt-secret-key-2026-indonesia'
);

const COOKIE_NAME = 'smartcbt_session';

// Role Permissions Mapping
const ROUTE_PERMISSIONS: { prefix: string; allowedRoles: string[] }[] = [
  { prefix: '/operator', allowedRoles: ['OPERATOR', 'SUPER_ADMIN'] },
  { prefix: '/guru', allowedRoles: ['TEACHER', 'SUPER_ADMIN'] },
  { prefix: '/siswa', allowedRoles: ['STUDENT'] },
  { prefix: '/admin', allowedRoles: ['SUPER_ADMIN'] },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Lewatkan static assets, api internal, dan favicon
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Ambil token dari HTTP-Only Cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;
  let userSession: any = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userSession = payload;
    } catch {
      userSession = null;
    }
  }

  // 3. Cek apakah rute saat ini membutuhkan proteksi RBAC
  const matchedRoute = ROUTE_PERMISSIONS.find((r) => pathname.startsWith(r.prefix));

  if (matchedRoute) {
    // A. Jika belum login sama sekali -> Arahkan ke login
    if (!userSession) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('view', 'LOGIN');
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // B. Jika sudah login tetapi role tidak diizinkan -> Tangkal akses
    if (!matchedRoute.allowedRoles.includes(userSession.role)) {
      const unauthorizedUrl = new URL('/', request.url);
      unauthorizedUrl.searchParams.set('unauthorized', 'true');
      unauthorizedUrl.searchParams.set('requiredRole', matchedRoute.allowedRoles.join(', '));
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // 4. Tambahkan header identitas user untuk Server Components
  const requestHeaders = new Headers(request.headers);
  if (userSession) {
    requestHeaders.set('x-user-id', userSession.userId || '');
    requestHeaders.set('x-user-role', userSession.role || '');
    requestHeaders.set('x-user-name', userSession.name || '');
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
