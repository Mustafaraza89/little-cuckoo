import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'PRODUCT_MANAGER', 'ORDER_MANAGER'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes except the admin login page
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('cuckoo_auth_token')?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Decode JWT payload (second part of token)
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) throw new Error('Malformed token');

      // Edge runtime supports atob
      const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(decodedJson);

      if (!payload || !ADMIN_ROLES.includes(payload.role)) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('error', 'unauthorized_role');
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
