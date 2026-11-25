'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  KeyRound,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import {
  setAdminAuth,
  verifyCurrentAuth
} from '../utils/auth';

export default function LoginPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in and visiting /login, immediately route to home page
  useEffect(() => {
    async function checkAuth() {
      const { authenticated } = await verifyCurrentAuth();
      if (authenticated) {
        router.replace('/');
        return;
      }
      setCheckingAuth(false);
    }
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrUsername: email.trim(),
          password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials. Please try again.');
      }

      // Save auth and immediately go to write page (no intermediate success page)
      setAdminAuth(data.token, data.admin);
      router.replace('/write');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center px-4 py-12 font-mono">
        <RefreshCw className="w-5 h-5 animate-spin text-neutral-400 mb-2" />
        <p className="text-xs text-neutral-400">Checking session...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center px-4 py-12 font-mono">
      <div className="w-full max-w-sm">
        {/* Navigation link back to home */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-900 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portfolio</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-7 shadow-xs">
          <div className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs font-medium"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
