'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
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
  LogOut,
  ShieldCheck,
  RefreshCw,
  FileText,
  Plus
} from 'lucide-react';
import {
  clearAdminAuth,
  verifyCurrentAuth,
  AdminUser,
  API_BASE_URL
} from '../utils/auth';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '@/app/components/ui/select';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get('slug') || searchParams.get('id');

  // Auth State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Article State
  const [postId, setPostId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>(['Engineering']);
  const [tagInput, setTagInput] = useState('');
  const [readTime, setReadTime] = useState('3 min read');
  const [project, setProject] = useState<string>('');
  const [seriesOrder, setSeriesOrder] = useState<number | ''>('');
  const [availableProjects, setAvailableProjects] = useState<Array<{ _id?: string; title: string }>>([]);
  const [isCustomProject, setIsCustomProject] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // Edit/Saved state tracking
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [savedBaseline, setSavedBaseline] = useState<{
    title: string;
    description: string;
    slug: string;
    content: string;
    tags: string[];
    project: string;
    seriesOrder: number | '';
    readTime: string;
  } | null>(null);

  // Checks whether the article has unsaved changes compared to the saved baseline
  const isDirty = React.useMemo(() => {
    if (!savedBaseline) return true; // Brand new article before initial save
    return (
      title.trim() !== savedBaseline.title.trim() ||
      description.trim() !== savedBaseline.description.trim() ||
      slug.trim() !== savedBaseline.slug.trim() ||
      content.trim() !== savedBaseline.content.trim() ||
      tags.join(',') !== savedBaseline.tags.join(',') ||
      project.trim() !== savedBaseline.project.trim() ||
      seriesOrder !== savedBaseline.seriesOrder ||
      readTime !== savedBaseline.readTime
    );
  }, [title, description, slug, content, tags, project, seriesOrder, readTime, savedBaseline]);

  // Check auth on mount: If admin is not in session, route immediately to login
  useEffect(() => {
    async function checkAuth() {
      const { authenticated, admin } = await verifyCurrentAuth();
      if (authenticated && admin) {
        setAdminUser(admin);
        setAuthChecking(false);
      } else {
        router.replace('/login');
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    clearAdminAuth();
    setAdminUser(null);
    router.replace('/login');
  };

  // Unique random short ID for new article slug (Medium/Substack pattern)
  const [articleShortId] = useState(() => Math.random().toString(36).substring(2, 8));

  // Auto-slug generator from title with unique ID suffix
  const generateSlug = (text: string) => {
    const base = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return base ? `${base}-${articleShortId}` : '';
  };

  // Fetch available projects to populate Group / Series selector
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setAvailableProjects(data);
        }
      })
      .catch(() => {});
  }, []);

  // Reset all state to start a fresh article
  const handleStartNewArticle = () => {
    setPostId(null);
    setTitle('');
    setDescription('');
    setSlug('');
    setContent('');
    setTags(['Engineering']);
    setTagInput('');
    setReadTime('3 min read');
    setProject('');
    setSeriesOrder('');
    setSavedBaseline(null);
    setIsEditingMode(false);
    setErrorMessage(null);
    setPublishSuccess(false);
    setIsCustomProject(false);
    router.replace('/write');
  };

  // If editing an existing article, fetch its details. If navigating to blank /write, reset state!
  useEffect(() => {
    if (editSlug) {
      setInitialLoading(true);
      fetch(`${API_BASE_URL}/api/posts/${editSlug}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.title) {
            setPostId(data._id || null);
            setTitle(data.title);
            setDescription(data.description || '');
            setSlug(data.slug || '');
            setContent(data.content || '');
            const postTags = Array.isArray(data.tags) ? data.tags : [];
            setTags(postTags);
            setReadTime(data.readTime || '4 min read');
            setProject(data.project || '');
            const order = typeof data.seriesOrder === 'number' && data.seriesOrder > 0 ? data.seriesOrder : '';
            setSeriesOrder(order);

            // Populate baseline to detect future changes
            setSavedBaseline({
              title: data.title,
              description: data.description || '',
              slug: data.slug || '',
              content: data.content || '',
              tags: postTags,
              project: data.project || '',
              seriesOrder: order,
              readTime: data.readTime || '4 min read',
            });
            setIsEditingMode(false);
          }
        })
        .catch(() => {})
        .finally(() => setInitialLoading(false));
    } else {
      // Unconditionally reset all state when navigating to blank /write
      setPostId(null);
      setTitle('');
      setDescription('');
      setSlug('');
      setContent('');
      setTags(['Engineering']);
      setTagInput('');
      setReadTime('3 min read');
      setProject('');
      setSeriesOrder('');
      setSavedBaseline(null);
      setIsEditingMode(false);
      setErrorMessage(null);
      setPublishSuccess(false);
      setIsCustomProject(false);
    }
  }, [editSlug]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!postId) {
      setSlug(generateSlug(val));
    }
  };

  const handleContentChange = (markdown: string) => {
    setContent(markdown);

    // Approximate read time based on word count
    const words = markdown.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    setReadTime(`${minutes} min read`);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      setErrorMessage('Please give your article a title before publishing.');
      return;
    }

    setIsPublishing(true);
    setErrorMessage(null);

    const postPayload = {
      title: title.trim(),
      description: description.trim() || title.trim(),
      slug: slug.trim() || generateSlug(title),
      content,
      tags: tags.length ? tags : ['Engineering'],
      project: project.trim(),
      seriesOrder: seriesOrder ? Number(seriesOrder) : 0,
      readTime: readTime || '3 min read',
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    try {
      const url = postId
        ? `${API_BASE_URL}/api/posts/${postId}`
        : `${API_BASE_URL}/api/posts`;

      const method = postId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postPayload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          clearAdminAuth();
          setAdminUser(null);
          router.replace('/login');
          return;
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save post to MongoDB');
      }

      const savedData = await res.json();
      const isNewPost = !postId;
      if (savedData._id) setPostId(savedData._id);
      if (savedData.slug) setSlug(savedData.slug);

      // If this was a new post, sync the browser URL to /write?slug=... so future visits to /write start clean
      if (isNewPost && (savedData.slug || savedData._id)) {
        router.replace(`/write?slug=${savedData.slug || savedData._id}`, { scroll: false });
      }

      // Update baseline with current saved values and exit edit mode
      setSavedBaseline({
        title: postPayload.title,
        description: postPayload.description,
        slug: postPayload.slug,
        content: postPayload.content,
        tags: [...postPayload.tags],
        project: postPayload.project,
        seriesOrder: postPayload.seriesOrder,
        readTime: postPayload.readTime,
      });
      setIsEditingMode(false);

      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error publishing article';
      setErrorMessage(msg);
    } finally {
      setIsPublishing(false);
    }
  };

  if (authChecking || !adminUser || initialLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center font-mono">
        <RefreshCw className="w-5 h-5 animate-spin text-neutral-400 mb-2" />
        <p className="text-xs text-neutral-400">
          Checking admin session...
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
              <span>{postId ? (isEditingMode ? 'Editing Post' : 'Post Saved') : 'Writing Studio'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono transition border ${
                previewMode
                  ? 'bg-neutral-100 text-neutral-900 border-neutral-300 font-semibold'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{previewMode ? 'Edit Mode' : 'Preview'}</span>
            </button>

            {postId && (
              <button
                type="button"
                onClick={handleStartNewArticle}
                title="Start a blank new article"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono transition border bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-neutral-500" />
                <span className="hidden sm:inline">New Article</span>
              </button>
            )}

            {postId ? (
              !isEditingMode ? (
                <button
                  type="button"
                  onClick={() => setIsEditingMode(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition border bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 shadow-2xs font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={!isDirty || isPublishing}
                  title={!isDirty ? 'Make any change to enable update' : 'Save updates to article'}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
                    !isDirty || isPublishing
                      ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed opacity-60'
                      : 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-50 shadow-2xs font-medium'
                  }`}
                >
                  <Save className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{isPublishing ? 'Updating...' : 'Update'}</span>
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition border bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 shadow-2xs font-medium disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5 text-neutral-500" />
                <span>{isPublishing ? 'Publishing...' : 'Publish Article'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
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
        {previewMode ? (
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

            {/* Project / Series Badge in Preview */}
            {project && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200/80 text-[11px] font-mono text-amber-800 mb-3">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  Part of series: <strong>{project}</strong>
                  {seriesOrder ? ` #${seriesOrder}` : ''}
                </span>
              </div>
            )}

            <h1 className="text-2xl sm:text-[26px] font-sans font-bold text-neutral-900 tracking-tight leading-snug mb-3">
              {title || 'Untitled Post'}
            </h1>

            {description && (
              <p className="text-sm font-sans text-neutral-600 mb-4 leading-relaxed italic">
                {description}
              </p>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
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
                {slug && (
                  <p className="text-[11px] font-mono text-neutral-400 mt-1 truncate">
                    URL: <span className="text-neutral-600">/writing/{slug}</span>
                  </p>
                )}
              </div>

              {/* Project / Series Selector */}
              <div className="pt-2 pb-1 border-t border-neutral-100 flex flex-wrap items-center gap-2.5 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-neutral-500">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-medium text-[11.5px]">Group / Series:</span>
                </div>

                {!isCustomProject ? (
                  <Select
                    value={project ? project : "__standalone__"}
                    onValueChange={(val) => {
                      if (val === '__custom__') {
                        setIsCustomProject(true);
                        setProject('');
                      } else if (val === '__standalone__') {
                        setProject('');
                      } else {
                        setProject(val);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[260px] sm:w-[280px]">
                      <SelectValue placeholder="Select group / series" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>General</SelectLabel>
                        <SelectItem value="__standalone__">Standalone / General Writing</SelectItem>
                      </SelectGroup>
                      {availableProjects.length > 0 && (
                        <>
                          <SelectSeparator />
                          <SelectGroup>
                            <SelectLabel>Existing Projects</SelectLabel>
                            {availableProjects.map((p) => (
                              <SelectItem key={p._id || p.title} value={p.title}>
                                {p.title}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </>
                      )}
                      <SelectSeparator />
                      <SelectGroup>
                        <SelectItem value="__custom__" className="text-amber-800 font-medium">
                          + Enter custom project / series...
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      placeholder="Project or series name..."
                      className="px-2.5 py-1 rounded-lg border border-neutral-300 bg-white text-neutral-800 text-xs font-mono focus:outline-none focus:border-amber-500"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomProject(false);
                        setProject('');
                      }}
                      className="text-[11px] text-neutral-400 hover:text-neutral-700 underline px-1"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {project && (
                  <div className="flex items-center gap-1.5 ml-1">
                    <span className="text-neutral-400 text-[11px]">#:</span>
                    <input
                      type="number"
                      min="1"
                      value={seriesOrder}
                      onChange={(e) => setSeriesOrder(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 1"
                      className="w-16 px-2 py-1 rounded-lg border border-neutral-200/90 bg-neutral-50 text-neutral-800 text-xs font-mono focus:outline-none focus:border-neutral-400"
                    />
                  </div>
                )}
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
                key={postId || 'new-article'}
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
