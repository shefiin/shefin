'use client';

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: string;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const USER_KEY = 'shefin_portfolio_admin_user';
const TOKEN_KEY = 'shefin_portfolio_admin_token';

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

export function setAdminAuth(tokenOrUser: any, possibleUser?: AdminUser): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);

  const user = (possibleUser && typeof possibleUser === 'object')
    ? possibleUser
    : (tokenOrUser && typeof tokenOrUser === 'object' ? tokenOrUser : null);

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export async function clearAdminAuth(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.warn('Failed to clear server session cookie:', err);
  }
}


export async function verifyCurrentAuth(): Promise<{ authenticated: boolean; admin?: AdminUser }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(data.admin));
      }
      return { authenticated: true, admin: data.admin };
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY);
    }
    return { authenticated: false };
  } catch {
    return { authenticated: false };
  }
}


