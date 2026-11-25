'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  Edit3,
  Calendar,
  Clock,
  Hash,
  ExternalLink,
  Save,
  AlertCircle,
  X,
  Lock,
  LogOut,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import {
  getAuthHeaders,
  setAdminAuth,
  clearAdminAuth,
  verifyCurrentAuth,
  AdminUser
} from '../utils/auth';

// Dynamically import BlockNote with SSR disabled (standard Next.js pattern for block editors)
const BlockNoteEditor = dynamic(
  () => import('./BlockNoteEditorComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[460px] rounded-2xl border border-neutral-200/80 bg-white p-8 animate-pulse flex items-center justify-center">
        <p className="font-mono text-xs text-neutral-400">Loading Notion / Medium editor...</p>
      </div>
    ),
  }
);

export default function WritingStudio() {
  const searchParams = useSearchParams();
  const editSlug = searchParams.get('slug') || searchParams.get('id');

  // Auth State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Article State
  const [postId, setPostId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>(['Engineering']);
  const [tagInput, setTagInput] = useState('');
  const [readTime, setReadTime] = useState('3 min read');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // Verify auth on mount
  useEffect(() => {
    async function checkAuth() {
      const { authenticated, admin } = await verifyCurrentAuth();
      if (authenticated && admin) {
        setAdminUser(admin);
      }
      setAuthChecking(false);
    }
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrUsername: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      setAdminAuth(data.token, data.admin);
      setAdminUser(data.admin);
      setLoginPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminAuth();
    setAdminUser(null);
  };

  // Auto-slug generator from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // If editing an existing article, fetch its details
  useEffect(() => {
    if (editSlug) {
      setInitialLoading(true);
      fetch(`http://localhost:5001/api/posts/${editSlug}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.title) {
            setPostId(data._id || null);
            setTitle(data.title);
            setDescription(data.description || '');
            setSlug(data.slug || '');
            setContent(data.content || '');
            setTags(Array.isArray(data.tags) ? data.tags : []);
            setReadTime(data.readTime || '4 min read');
          }
        })
        .catch(() => {})
        .finally(() => setInitialLoading(false));
    }
  }, [editSlug]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const handleContentChange = (markdown: string, _html: string, text: string) => {
    setContent(markdown);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    setReadTime(`${minutes} min read`);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handlePublish = async () => {
    if (!adminUser) {
      setErrorMessage('Admin login required to publish or update articles.');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Please provide an article title.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please add a short summary description for preview cards.');
      return;
    }

    const finalSlug = slug.trim() || generateSlug(title);
    if (!finalSlug) {
      setErrorMessage('Please enter an article title.');
      return;
    }

    setIsPublishing(true);
    setErrorMessage(null);

    const postPayload = {
      title: title.trim(),
      slug: finalSlug,
      description: description.trim(),
      content: content.trim(),
      readTime,
      tags,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      published: true,
    };

    try {
      const url = postId
        ? `http://localhost:5001/api/posts/${postId}`
        : 'http://localhost:5001/api/posts';
      const method = postId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(postPayload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          clearAdminAuth();
          setAdminUser(null);
          throw new Error('Your admin session expired. Please log in again.');
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save post to MongoDB');
      }

      const savedData = await res.json();
      if (savedData._id) setPostId(savedData._id);
      if (savedData.slug) setSlug(savedData.slug);

      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error publishing article';
      setErrorMessage(msg);
    } finally {
      setIsPublishing(false);
    }
  };

  if (authChecking || initialLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <p className="font-mono text-xs text-neutral-400 animate-pulse">
          Connecting to Shefin Portfolio...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-800 antialiased selection:bg-amber-100">
      {/* Top Studio Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-[840px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-neutral-900 transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Portfolio</span>
            </Link>

            <span className="text-neutral-300 font-mono">/</span>

            <span className="text-xs font-mono font-medium text-neutral-700 flex items-center gap-1.5">
              <Edit3 className="w-3 h-3 text-amber-600" />
              <span>{postId ? 'Editing Post' : 'Writing Studio'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {adminUser ? (
              <>
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200/70 text-[11px] font-mono text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{adminUser.email}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono transition border ${
                    previewMode
                      ? 'bg-neutral-100 text-neutral-900 border-neutral-300 font-semibold'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{previewMode ? 'Edit Mode' : 'Preview'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-neutral-900 hover:bg-neutral-800 text-white transition disabled:opacity-50 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isPublishing ? 'Publishing...' : postId ? 'Update Post' : 'Publish Article'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out as Admin"
                  className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Locked</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {publishSuccess && (
        <div className="max-w-[840px] mx-auto px-4 sm:px-6 mt-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Article successfully stored in MongoDB!</span>
            </div>
            <Link
              href={`/writing/${slug}`}
              className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-emerald-700"
            >
              <span>View live article</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="max-w-[840px] mx-auto px-4 sm:px-6 mt-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-900 text-xs font-mono">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button type="button" onClick={() => setErrorMessage(null)}>
              <X className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-[840px] mx-auto px-4 sm:px-6 pt-8 pb-24">
        {!adminUser ? (
          /* ADMIN LOGIN GATE */
          <div className="max-w-sm mx-auto my-12 p-6 sm:p-7 rounded-2xl border border-neutral-200/90 bg-white shadow-xs">
            {loginError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono text-neutral-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-500 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono rounded-lg transition disabled:opacity-50 shadow-xs flex items-center justify-center gap-2"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>{loginLoading ? 'Signing in...' : 'Sign In'}</span>
              </button>
            </form>
          </div>
        ) : previewMode ? (
          /* PREVIEW MODE */
          <div className="max-w-[620px] mx-auto">
            <div className="p-2 mb-6 rounded-lg bg-amber-50/80 border border-amber-200/60 text-[11px] font-mono text-amber-800 flex items-center justify-between">
              <span>Previewing how your article will look on your portfolio:</span>
              <button
                onClick={() => setPreviewMode(false)}
                className="underline hover:text-amber-900 font-semibold"
              >
                Back to editor
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 mb-2.5">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3 text-neutral-400" />
                {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-400" />
                {readTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-[26px] font-sans font-bold text-neutral-900 tracking-tight leading-snug mb-3">
              {title || 'Untitled Post'}
            </h1>

            <p className="text-[13.5px] font-mono text-neutral-500 leading-relaxed mb-4">
              {description || 'Summary description will appear here...'}
            </p>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1 mb-6">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-0.5 text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200/70"
                  >
                    <Hash className="w-2.5 h-2.5 text-neutral-400" />
                    {t}
                  </span>
                ))}
              </div>
            )}

            <hr className="border-neutral-200/80 mb-8" />

            <div className="article-body whitespace-pre-wrap font-sans text-[14.5px] text-neutral-800 leading-relaxed">
              {content || 'No content written yet.'}
            </div>
          </div>
        ) : (
          /* EDIT MODE */
          <div className="space-y-6">
            {/* Metadata Section */}
            <div className="p-6 rounded-2xl border border-neutral-200/80 bg-white space-y-4 shadow-2xs">
              {/* Title */}
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Article Title..."
                  className="w-full text-2xl sm:text-3xl font-sans font-bold text-neutral-900 placeholder:text-neutral-300 focus:outline-none bg-transparent tracking-tight"
                />
              </div>

              {/* Description / Summary */}
              <div>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary description (displayed on the portfolio card)..."
                  className="w-full text-xs sm:text-[13px] font-mono text-neutral-600 placeholder:text-neutral-300 focus:outline-none bg-transparent resize-none leading-relaxed"
                />
              </div>

              {/* Tags & Read Time Bar */}
              <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/80"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-neutral-400 hover:text-neutral-700 ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="+ Add tag (press Enter)"
                    className="text-[11px] font-mono px-2 py-0.5 bg-transparent text-neutral-600 placeholder:text-neutral-400 focus:outline-none"
                  />
                </div>

                {/* Read time badge */}
                <div className="flex items-center gap-1 text-neutral-400 shrink-0 text-[11px] font-mono">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  <span>{readTime}</span>
                </div>
              </div>
            </div>

            {/* BlockNote Ready-Made Editor Canvas */}
            <div>
              <BlockNoteEditor
                initialContent={content}
                onChange={handleContentChange}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
