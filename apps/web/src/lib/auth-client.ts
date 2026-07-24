import { TokenResponse, User, LoginRequest, RegisterRequest, UserRole } from '@sitebrain/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const authClient = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('sitebrain_access_token');
  },

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('sitebrain_refresh_token');
  },

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('sitebrain_access_token', accessToken);
    localStorage.setItem('sitebrain_refresh_token', refreshToken);
  },

  clearTokens() {
    localStorage.removeItem('sitebrain_access_token');
    localStorage.removeItem('sitebrain_refresh_token');
  },

  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Authentication failed');
    }

    this.setTokens(data.access_token, data.refresh_token);
    return data;
  },

  async register(data: RegisterRequest): Promise<{ message: string; token?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        full_name: data.fullName,
        role: data.role,
      }),
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.detail || 'Registration failed');
    }
    return resData;
  },

  async forgotPassword(email: string): Promise<{ message: string; token?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Request failed');
    }
    return data;
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password: newPassword }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Password reset failed');
    }
    return data;
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Verification failed');
    }
    return data;
  },

  async getMe(): Promise<User> {
    const token = this.getToken();
    if (!token) throw new Error('No access token');

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to fetch user profile');
    }
    return data;
  },

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }).catch(() => {});
    }
    this.clearTokens();
  },
};
