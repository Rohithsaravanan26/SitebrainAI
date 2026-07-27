import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  type: string;
  exp: number;
}

// Safely decode Base64URL JWT payload in Edge runtime
function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard and all subroutes
  if (pathname.startsWith('/dashboard')) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    let isValidAccess = false;
    let userRole: string | null = null;

    if (accessToken) {
      const payload = decodeJwt(accessToken);
      if (payload && payload.exp * 1000 > Date.now()) {
        isValidAccess = true;
        userRole = payload.role;
      }
    }

    // Attempt automatic background token refresh if access token expired
    if (!isValidAccess && refreshToken) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const refreshRes = await fetch(`${apiUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          const newAccessToken = data.access_token || data.accessToken;
          const newRefreshToken = data.refresh_token || data.refreshToken;

          const response = NextResponse.next();
          if (newAccessToken) {
            response.cookies.set('accessToken', newAccessToken, {
              path: '/',
              maxAge: 86400,
              sameSite: 'lax',
            });
          }
          if (newRefreshToken) {
            response.cookies.set('refreshToken', newRefreshToken, {
              path: '/',
              maxAge: 7 * 86400,
              sameSite: 'lax',
            });
          }
          return response;
        }
      } catch {
        // Fall through to redirect
      }
    }

    // Redirect to login if unauthenticated
    if (!isValidAccess) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }

    // Role-based route restriction example
    if (
      pathname.startsWith('/dashboard/settings') &&
      userRole &&
      !['ADMIN', 'PROJECT_MANAGER'].includes(userRole)
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
