'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Search,
  FileText,
  BookOpen,
  Hash,
  PenLine,
  Layers,
  Sparkles
} from 'lucide-react';
import { verifyCurrentAuth } from '../utils/auth';

interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  readTime: string;
  tags?: string[];
  project?: string;
  seriesOrder?: number;
  published?: boolean;
}

const fallbackPosts: BlogPost[] = [
  {
    _id: '1',
    title: 'Designing Scalable Distributed Systems with Node.js & MongoDB',
    slug: 'designing-scalable-distributed-systems-nodejs-mongodb',
    description: 'Deep dive into idempotency, distributed locks, database indexing strategies, and failure isolation patterns in high-throughput services.',
    date: 'Nov 2026',
    readTime: '6 min read',
    tags: ['Distributed Systems', 'MongoDB', 'Node.js', 'Redis'],
    project: 'CureHome — Telehealth platform',
    seriesOrder: 1,
  },
  {
    _id: '2',
    title: 'Fullstack Architecture with Next.js & Express',
    slug: 'fullstack-architecture-nextjs-express',
    description: 'Clean separation of concerns: Next.js frontend orchestrating Server Components and a resilient Express microservice tier.',
    date: 'Oct 2026',
    readTime: '5 min read',
    tags: ['Next.js', 'Express', 'Architecture', 'TypeScript'],
    project: 'CureHome — Telehealth platform',
    seriesOrder: 2,
  },
  {
    _id: '3',
    title: 'Building Microservices Without Over-Engineering',
    slug: 'building-microservices-without-over-engineering',
    description: 'A pragmatic software engineer\'s perspective on when to break monoliths, managing data boundaries, and event-driven communication.',
    date: 'Aug 2026',
    readTime: '4 min read',
    tags: ['Architecture', 'APIs', 'Engineering'],
    project: '',
    seriesOrder: 0,
  },
];

function WritingsList() {
  const searchParams = useSearchParams();
  const initialProjectFilter = searchParams.get('project') || '';

  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'projects' | 'standalone'>('all');
  const [selectedProject, setSelectedProject] = useState<string>(initialProjectFilter);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin session
  useEffect(() => {
    async function checkAuth() {
      const { authenticated, admin } = await verifyCurrentAuth();
      if (authenticated && admin) {
        setIsAdmin(true);
      }
    }
    checkAuth();
  }, []);

  // Fetch posts from Express API
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('http://localhost:5001/api/posts');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPosts(data);
          }
        }
      } catch (err) {
        console.error('Using fallback posts:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Sync project filter from URL if changed
  useEffect(() => {
    if (initialProjectFilter) {
      setSelectedProject(initialProjectFilter);
      setSelectedTab('projects');
    }
  }, [initialProjectFilter]);

  // Unique list of projects present in posts
  const projectNames = useMemo(() => {
    const names = new Set<string>();
    posts.forEach((p) => {
      if (p.project && p.project.trim()) {
        names.add(p.project.trim());
      }
    });
    return Array.from(names);
  }, [posts]);

  // Filter posts based on search, tab, and project filter
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesDesc = post.description.toLowerCase().includes(q);
        const matchesProject = post.project ? post.project.toLowerCase().includes(q) : false;
        const matchesTags = post.tags ? post.tags.some((t) => t.toLowerCase().includes(q)) : false;
        if (!matchesTitle && !matchesDesc && !matchesProject && !matchesTags) {
          return false;
        }
      }

      // Tab filter
      if (selectedTab === 'projects') {
        if (!post.project || !post.project.trim()) return false;
        if (selectedProject && post.project !== selectedProject) return false;
      } else if (selectedTab === 'standalone') {
        if (post.project && post.project.trim()) return false;
      }

      return true;
    });
  }, [posts, searchQuery, selectedTab, selectedProject]);

  // Group filtered posts by project vs standalone
  const { projectGroups, standalonePosts } = useMemo(() => {
    const groups: Record<string, BlogPost[]> = {};
    const standalone: BlogPost[] = [];

    filteredPosts.forEach((post) => {
      if (post.project && post.project.trim()) {
        const projName = post.project.trim();
        if (!groups[projName]) {
          groups[projName] = [];
        }
        groups[projName].push(post);
      } else {
        standalone.push(post);
      }
    });

    // Sort within each project group by seriesOrder or date
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => {
        if (a.seriesOrder && b.seriesOrder) {
          return a.seriesOrder - b.seriesOrder;
        }
        return (a.seriesOrder || 999) - (b.seriesOrder || 999);
      });
    });

    return { projectGroups: groups, standalonePosts: standalone };
  }, [filteredPosts]);

  const totalProjectsCount = projectNames.length;
  const projectPostsCount = posts.filter((p) => p.project && p.project.trim()).length;
  const standalonePostsCount = posts.filter((p) => !p.project || !p.project.trim()).length;

  return (
    <div className="max-w-[620px] mx-auto py-16 px-6 sm:px-8 font-mono text-neutral-900 selection:bg-amber-100">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Portfolio</span>
        </Link>

        {isAdmin && (
          <Link
            href="/write"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-[11.5px] text-neutral-800 transition"
          >
            <PenLine className="w-3 h-3 text-amber-600" />
            <span>Write New</span>
          </Link>
        )}
      </div>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-[26px] font-sans font-bold text-neutral-900 tracking-tight leading-snug mb-2">
          Engineering Logs & Articles
        </h1>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Documenting real-world distributed architectures, project builds from conception to scale, and standalone engineering notes.
        </p>
      </header>

      {/* Tabs & Search */}
      <div className="space-y-3 mb-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-200/80 pb-3">
          <button
            onClick={() => {
              setSelectedTab('all');
              setSelectedProject('');
            }}
            className={`px-3 py-1 rounded-lg text-xs transition ${selectedTab === 'all'
              ? 'bg-neutral-900 text-white font-medium'
              : 'bg-neutral-100/70 text-neutral-600 hover:bg-neutral-200/60'
              }`}
          >
            All Writings ({posts.length})
          </button>

          <button
            onClick={() => setSelectedTab('projects')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition ${selectedTab === 'projects'
              ? 'bg-neutral-900 text-white font-medium'
              : 'bg-neutral-100/70 text-neutral-600 hover:bg-neutral-200/60'
              }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            <span>Project Series ({projectPostsCount})</span>
          </button>

          <button
            onClick={() => {
              setSelectedTab('standalone');
              setSelectedProject('');
            }}
            className={`px-3 py-1 rounded-lg text-xs transition ${selectedTab === 'standalone'
              ? 'bg-neutral-900 text-white font-medium'
              : 'bg-neutral-100/70 text-neutral-600 hover:bg-neutral-200/60'
              }`}
          >
            Standalone Notes ({standalonePostsCount})
          </button>
        </div>

        {/* Project Sub-Filter (when in Projects tab) */}
        {selectedTab === 'projects' && totalProjectsCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-neutral-400 mr-1">Project:</span>
            <button
              onClick={() => setSelectedProject('')}
              className={`px-2 py-0.5 rounded text-[11px] transition ${selectedProject === ''
                ? 'bg-amber-100 text-amber-900 font-semibold border border-amber-300'
                : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                }`}
            >
              All Projects
            </button>
            {projectNames.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedProject(name)}
                className={`px-2 py-0.5 rounded text-[11px] transition ${selectedProject === name
                  ? 'bg-amber-100 text-amber-900 font-semibold border border-amber-300'
                  : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                  }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, topic (#tag), or project..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50/50 text-xs placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-12 text-center text-xs text-neutral-400">
          Loading writings...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-neutral-200 rounded-xl p-8">
          <p className="text-xs text-neutral-500 mb-2">No writings found matching your filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTab('all');
              setSelectedProject('');
            }}
            className="text-[11px] text-amber-700 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* SECTION: PROJECT SERIES GROUPS */}
          {Object.keys(projectGroups).length > 0 && selectedTab !== 'standalone' && (
            <div className="space-y-8">
              {Object.entries(projectGroups).map(([projectName, groupPosts]) => (
                <div key={projectName} className="space-y-3">
                  {/* Project Series Header */}
                  <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-neutral-200">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                      <h2 className="text-xs font-semibold text-neutral-900 tracking-tight">
                        {projectName}
                      </h2>
                    </div>
                    <span className="text-[10.5px] text-neutral-400">
                      {groupPosts.length} {groupPosts.length === 1 ? 'article' : 'articles'} in series
                    </span>
                  </div>

                  {/* Articles in this project series */}
                  <div className="space-y-2.5 pl-1 sm:pl-2">
                    {groupPosts.map((post) => (
                      <Link
                        key={post._id || post.slug}
                        href={`/writing/${post.slug}`}
                        className="group block p-3.5 rounded-xl border border-neutral-200/90 bg-white hover:border-neutral-300 hover:shadow-2xs transition-all"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 text-[10.5px] text-neutral-400">
                            {post.seriesOrder ? (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100/90 text-amber-900 font-semibold border border-amber-200/60 text-[10px]">
                                Part {post.seriesOrder}
                              </span>
                            ) : null}
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
                        </div>

                        <h3 className="text-xs font-semibold text-neutral-900 group-hover:text-amber-700 transition leading-snug mb-1">
                          {post.title}
                        </h3>

                        <p className="text-[11.5px] text-neutral-500 leading-relaxed line-clamp-2">
                          {post.description}
                        </p>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.map((t) => (
                              <span
                                key={t}
                                className="text-[9.5px] px-1.5 py-[1px] rounded bg-neutral-100 text-neutral-600 border border-neutral-200/50"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION: STANDALONE WRITINGS */}
          {standalonePosts.length > 0 && selectedTab !== 'projects' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
                  <h2 className="text-xs font-semibold text-neutral-900 uppercase tracking-widest text-[11px]">
                    STANDALONE & GENERAL WRITINGS
                  </h2>
                </div>
                <span className="text-[10.5px] text-neutral-400">
                  {standalonePosts.length} {standalonePosts.length === 1 ? 'article' : 'articles'}
                </span>
              </div>

              <div className="space-y-2.5">
                {standalonePosts.map((post) => (
                  <Link
                    key={post._id || post.slug}
                    href={`/writing/${post.slug}`}
                    className="group block p-3.5 rounded-xl border border-neutral-200/90 bg-white hover:border-neutral-300 hover:shadow-2xs transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 text-[10.5px] text-neutral-400">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
                    </div>

                    <h3 className="text-xs font-semibold text-neutral-900 group-hover:text-amber-700 transition leading-snug mb-1">
                      {post.title}
                    </h3>

                    <p className="text-[11.5px] text-neutral-500 leading-relaxed line-clamp-2">
                      {post.description}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9.5px] px-1.5 py-[1px] rounded bg-neutral-100 text-neutral-600 border border-neutral-200/50"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function WritingIndexPage() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={<div className="max-w-[620px] mx-auto py-16 px-6 font-mono text-xs text-neutral-400">Loading writings...</div>}>
        <WritingsList />
      </Suspense>
    </main>
  );
}

