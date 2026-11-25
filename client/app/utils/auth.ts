'use client';

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: string;
}

const TOKEN_KEY = 'shefin_portfolio_admin_token';
const USER_KEY = 'shefin_portfolio_admin_user';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function setAdminAuth(token: string, user: AdminUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAdminAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function verifyCurrentAuth(): Promise<{ authenticated: boolean; admin?: AdminUser }> {
  const token = getAdminToken();
  if (!token) return { authenticated: false };

  try {
    const res = await fetch('http://localhost:5001/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return { authenticated: true, admin: data.admin };
    }
    clearAdminAuth();
    return { authenticated: false };
  } catch {
    // If backend is unreachable but token is locally stored, return cached status
    const cachedUser = getStoredAdminUser();
    return { authenticated: !!cachedUser, admin: cachedUser || undefined };
  }
}

