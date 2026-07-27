import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
  ApiResponse,
} from '@sitebrain/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Helper to set cookies for SSR middleware compatibility
function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function eraseCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export const authClient = {
  // Store authentication tokens in localStorage and cookies
  setSession(tokens: TokenResponse) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(tokens.user));

      setCookie('accessToken', tokens.accessToken, 1);
      setCookie('refreshToken', tokens.refreshToken, 7);
    }
  },

  // Clear authentication tokens and cookies
  clearSession() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      eraseCookie('accessToken');
      eraseCookie('refreshToken');
    }
  },

  // Get current stored user
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Get current access token
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken') || getCookie('accessToken');
  },

  // Get current refresh token
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken') || getCookie('refreshToken');
  },

  // Login call
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Authentication failed' }));
      throw new Error(errorData.detail || 'Invalid email or password');
    }

    const data: TokenResponse = await res.json();
    this.setSession(data);
    return data;
  },

  // Register call
  async register(data: RegisterRequest): Promise<TokenResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(errorData.detail || 'Registration failed');
    }

    const tokenData: TokenResponse = await res.json();
    this.setSession(tokenData);
    return tokenData;
  },

  // Refresh Token call
  async refreshToken(): Promise<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearSession();
      throw new Error('No refresh token available');
    }

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      this.clearSession();
      throw new Error('Session expired. Please log in again.');
    }

    const data: TokenResponse = await res.json();
    this.setSession(data);
    return data;
  },

  // Logout call
  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getAccessToken();

    if (refreshToken && accessToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        // Silently clear local session if network request fails
      }
    }

    this.clearSession();
  },
};
