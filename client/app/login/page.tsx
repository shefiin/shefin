'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  LogOut,
  PenLine,
  ArrowRight
} from 'lucide-react';
import {
  setAdminAuth,
  clearAdminAuth,
  verifyCurrentAuth,
  AdminUser
} from '../utils/auth';

export default function LoginPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const { authenticated, admin } = await verifyCurrentAuth();
      if (authenticated && admin) {
        setAdminUser(admin);
      }
      setCheckingAuth(false);
    }
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrUsername: emailOrUsername.trim(),
          password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials. Please try again.');
      }

      setAdminAuth(data.token, data.admin);
      setAdminUser(data.admin);
      setPassword('');
      setSuccessNotice('Signed in successfully! Redirecting...');
      setTimeout(() => {
        router.push('/write');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminAuth();
    setAdminUser(null);
    setSuccessNotice('Signed out of admin session');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

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
          {checkingAuth ? (
            <div className="py-10 flex flex-col items-center justify-center text-neutral-400">
              <RefreshCw className="w-4 h-4 animate-spin mb-2" />
              <p className="text-xs">Checking session...</p>
            </div>
          ) : adminUser ? (
            /* Already logged in view */
            <div className="space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-neutral-900 font-sans">
                    Authenticated
                  </h1>
                  <p className="text-xs text-neutral-500">{adminUser.email}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[11.5px]">Admin session active</span>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/write"
                  className="w-full py-2 px-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs flex items-center justify-center gap-2 transition"
                >
                  <PenLine className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Writing Studio</span>
                  <ArrowRight className="w-3 h-3 ml-auto text-neutral-400" />
                </Link>

                <Link
                  href="/"
                  className="w-full py-2 px-3.5 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-lg text-xs flex items-center justify-center gap-2 transition"
                >
                  <span>View Portfolio</span>
                  <ArrowRight className="w-3 h-3 ml-auto text-neutral-400" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3.5 hover:bg-red-50 text-neutral-400 hover:text-red-600 rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Minimal Clean Form */
            <div className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successNotice && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span>{successNotice}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">
                    Email or Username
                  </label>
                  <input
                    type="text"
                    required
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
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
          )}
        </div>
      </div>
    </main>
  );
}
