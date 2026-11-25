'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  PenLine,
  Edit3,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
  Hash,
  RefreshCw,
  LogOut,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  getAuthHeaders,
  clearAdminAuth,
  verifyCurrentAuth,
  AdminUser
} from '../utils/auth';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  readTime: string;
  tags?: string[];
  content?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Guard: Must be authenticated as Admin
  useEffect(() => {
    async function checkAuth() {
      const { authenticated, admin } = await verifyCurrentAuth();
      if (authenticated && admin) {
        setAdminUser(admin);
        setCheckingAuth(false);
        fetchPosts();
      } else {
        router.replace('/login');
      }
    }
    checkAuth();
  }, [router]);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch('http://localhost:5001/api/posts');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${post.title}"?\n\nThis will permanently remove the article from your portfolio.`
    );
    if (!confirmed) return;

    setDeletingId(post._id);
    try {
      const res = await fetch(`http://localhost:5001/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders()
        }
      });

      if (res.status === 401) {
        clearAdminAuth();
        router.replace('/login');
        return;
      }

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== post._id));
        setNotice(`Deleted "${post.title}"`);
        setTimeout(() => setNotice(null), 3500);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to delete post');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend server');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    clearAdminAuth();
    router.replace('/login');
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center px-4 py-12 font-mono">
        <RefreshCw className="w-5 h-5 animate-spin text-neutral-400 mb-2" />
        <p className="text-xs text-neutral-400">Verifying admin session...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-neutral-900 font-mono py-12 px-5 sm:px-8">
      <div className="max-w-[660px] mx-auto">
        {/* Top Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            aria-label="Back to portfolio"
            title="Back to portfolio"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-900 transition group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Portfolio</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/write"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 border border-neutral-200 transition"
            >
              <PenLine className="w-3.5 h-3.5 text-neutral-500" />
              <span>Write</span>
            </Link>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 border border-transparent transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="mb-8 p-5 rounded-2xl border border-neutral-200/80 bg-white shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-200 shrink-0">
            <Image
              src="/shefin.png"
              alt="Shefin"
              width={48}
              height={48}
              priority
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold font-sans text-neutral-900">
              Shefin
            </h1>
            <p className="text-xs text-neutral-500 truncate">
              {adminUser?.email || 'shefinptr@gmail.com'}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-sm font-bold text-neutral-900 font-sans">
              {posts.length}
            </div>
            <div className="text-[11px] text-neutral-400">
              Articles
            </div>
          </div>
        </div>

        {/* Notification Notice */}
        {notice && (
          <div className="mb-6 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Articles List Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium">
            Articles ({posts.length})
          </h2>

          <button
            onClick={fetchPosts}
            disabled={loadingPosts}
            className="text-[11px] text-neutral-400 hover:text-neutral-800 transition flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${loadingPosts ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Articles List */}
        {loadingPosts && posts.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-400">
            <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" />
            Loading articles...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-neutral-200 bg-white space-y-2">
            <p className="text-xs text-neutral-500">No articles published yet.</p>
            <Link
              href="/write"
              className="inline-block text-xs text-neutral-900 underline underline-offset-2"
            >
              Write your first post →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post._id || post.slug}
                className="p-4 rounded-2xl border border-neutral-200/80 bg-white hover:border-neutral-300 transition-all shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-[10.5px] text-neutral-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <Link
                      href={`/writing/${post.slug || post._id}`}
                      className="block text-sm font-semibold font-sans text-neutral-900 hover:text-neutral-600 transition truncate"
                    >
                      {post.title}
                    </Link>

                    <p className="text-xs text-neutral-500 line-clamp-1">
                      {post.description}
                    </p>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <Link
                      href={`/writing/${post.slug || post._id}`}
                      title="View Article"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/write?slug=${post.slug || post._id}`}
                      title="Edit Article"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(post)}
                      disabled={deletingId === post._id}
                      title="Delete Article"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                    >
                      {deletingId === post._id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Tags and URL slug */}
                <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-[10.5px]">
                  <div className="flex flex-wrap gap-1">
                    {post.tags && post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-neutral-400 font-mono truncate max-w-[240px]">
                    /writing/{post.slug}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

