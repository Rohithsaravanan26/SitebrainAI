import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard and all subroutes
  if (pathname.startsWith('/dashboard')) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const authHeader = request.headers.get('authorization');

    // If client has no session token cookie or auth header in browser
    // Note: In Next.js client, auth-client syncs token with cookie/localStorage
    // For middleware demo, we allow pass-through if cookie or standard client session marker is present
    // or if running in local dev preview mode.
    const isDev = process.env.NODE_ENV === 'development';

    if (!accessToken && !authHeader && !isDev) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
