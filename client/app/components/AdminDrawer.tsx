'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Database, RefreshCw, Plus, CheckCircle, Mail, Globe, Server, Check, BookOpen, Trash2, Edit3, PenLine } from 'lucide-react';

interface Project {
  _id?: string;
  title: string;
  description: string;
  status: string;
  iconKey: string;
  link?: string;
  sourceCode?: string;
  tags?: string[];
  bullets?: string[];
}

interface BlogPost {
  _id?: string;
  title: string;
  slug?: string;
  description: string;
  date: string;
  readTime: string;
  link?: string;
  tags?: string[];
  content?: string;
}

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRefresh: () => void;
  available: boolean;
  onToggleAvailability: (val: boolean) => void;
}

export function AdminDrawer({
  isOpen,
  onClose,
  onDataRefresh,
  available,
  onToggleAvailability
}: AdminDrawerProps) {
  const [activeTab, setActiveTab] = useState<'messages' | 'projects' | 'posts' | 'status'>('messages');
  const [messages, setMessages] = useState<Message[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [health, setHealth] = useState<{ status: string; mongoConnected: boolean } | null>(null);

  // New project state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStatus, setNewStatus] = useState('Active');
  const [newIcon, setNewIcon] = useState('curehome');
  const [newLink, setNewLink] = useState('');
  const [newSourceCode, setNewSourceCode] = useState('');
  const [newTags, setNewTags] = useState('');
  const [submittingProject, setSubmittingProject] = useState(false);

  // New blog post state
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDesc, setNewPostDesc] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [newPostLink, setNewPostLink] = useState('https://substack.com/@shefin204168');
  const [newPostReadTime, setNewPostReadTime] = useState('5 min read');
  const [submittingPost, setSubmittingPost] = useState(false);

  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
      fetchMessages();
      fetchPosts();
    }
  }, [isOpen]);

  const fetchHealth = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/health');
      const data = await res.json();
      setHealth(data);
    } catch {
      setHealth({ status: 'offline', mongoConnected: false });
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch('http://localhost:5001/api/contact');
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch('http://localhost:5001/api/posts');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProject(true);
    try {
      const tagsArray = newTags
        ? newTags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const res = await fetch('http://localhost:5001/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          status: newStatus,
          iconKey: newIcon,
          link: newLink || '#',
          sourceCode: newSourceCode,
          tags: tagsArray
        })
      });
      if (res.ok) {
        setNewTitle('');
        setNewDesc('');
        setNewLink('');
        setNewSourceCode('');
        setNewTags('');
        setActionNotice('Project added to MongoDB successfully!');
        setTimeout(() => setActionNotice(null), 3000);
        onDataRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingProject(false);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingPost(true);
    try {
      const tagsArray = newPostTags
        ? newPostTags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const generatedSlug = newPostTitle
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const res = await fetch('http://localhost:5001/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPostTitle,
          slug: generatedSlug,
          description: newPostDesc,
          tags: tagsArray,
          readTime: newPostReadTime || '5 min read',
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        })
      });
      if (res.ok) {
        setNewPostTitle('');
        setNewPostDesc('');
        setNewPostTags('');
        setActionNotice('Blog post added to MongoDB successfully!');
        setTimeout(() => setActionNotice(null), 3000);
        fetchPosts();
        onDataRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Delete this blog post from MongoDB?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/posts/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setActionNotice('Blog post deleted!');
        setTimeout(() => setActionNotice(null), 3000);
        fetchPosts();
        onDataRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetSeed = async () => {
    if (!confirm('Re-seed the database back to original portfolio defaults?')) return;
    try {
      const res = await fetch('http://localhost:5001/api/seed', { method: 'POST' });
      if (res.ok) {
        setActionNotice('Database re-seeded with initial portfolio data!');
        setTimeout(() => setActionNotice(null), 3000);
        fetchMessages();
        onDataRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 font-sans">
                MongoDB & Express Control Panel
              </h2>
              <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500">
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${health?.mongoConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {health?.mongoConnected ? 'Mongo: Connected' : 'Mongo: Connecting'}
                </span>
                <span>•</span>
                <span>Port 5001</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-200 text-neutral-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action notice */}
        {actionNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-mono text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 bg-white">
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-2.5 text-xs font-mono font-medium transition border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'messages'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Messages ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 py-2.5 text-xs font-mono font-medium transition border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'projects'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2.5 text-xs font-mono font-medium transition border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'posts'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Blog ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-2.5 text-xs font-mono font-medium transition border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'status'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'messages' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-neutral-500">
                  Inbox in MongoDB (`contactmessages`)
                </span>
                <button
                  onClick={fetchMessages}
                  className="text-[11px] font-mono text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
              </div>

              {loadingMessages ? (
                <div className="text-center py-8 text-xs font-mono text-neutral-400">
                  Loading messages from MongoDB...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-neutral-200 rounded-xl p-6">
                  <Mail className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-xs font-mono text-neutral-600">
                    No messages yet in MongoDB.
                  </p>
                  <p className="text-[11px] font-mono text-neutral-400 mt-1">
                    Click &apos;Send an email&apos; or press &apos;E&apos; on the portfolio to send one!
                  </p>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m._id} className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-900 font-sans">
                        {m.name}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500">
                      {m.email}
                    </div>
                    <p className="text-xs font-mono text-neutral-700 bg-white p-2.5 rounded-lg border border-neutral-200/80 mt-1">
                      {m.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <form onSubmit={handleAddProject} className="space-y-3">
              <p className="text-xs font-mono text-neutral-500">
                Add a new project document directly to MongoDB collection:
              </p>

              <div>
                <label className="block text-xs font-mono text-neutral-600 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AI Workflow Engine"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-600 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief description of the product or system..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono text-neutral-600 mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-mono rounded-lg border border-neutral-200 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Sold">Sold</option>
                    <option value="Building">Building</option>
                    <option value="Beta">Beta</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-600 mb-1">
                    Icon
                  </label>
                  <select
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-mono rounded-lg border border-neutral-200 bg-white"
                  >
                    <option value="curehome">Activity / Telehealth</option>
                    <option value="mic">Mic / Audio</option>
                    <option value="cat">Cat / Mascot</option>
                    <option value="bluesky">Bluesky Butterfly</option>
                    <option value="database">Database</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-600 mb-1">
                  Source Code URL (Optional)
                </label>
                <input
                  type="text"
                  value={newSourceCode}
                  onChange={(e) => setNewSourceCode(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-600 mb-1">
                  Tech Stack Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="typescript, react, gRPC, nats, docker sandbox..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-600 mb-1">
                  Project Link (Optional)
                </label>
                <input
                  type="text"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <button
                type="submit"
                disabled={submittingProject}
                className="w-full mt-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono rounded-lg transition disabled:opacity-50"
              >
                {submittingProject ? 'Writing to MongoDB...' : '+ Save Project to MongoDB'}
              </button>
            </form>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-4">
              {/* Dedicated Writing Studio Promo Card */}
              <Link
                href="/write"
                onClick={onClose}
                className="flex items-center justify-between p-3.5 rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-50/70 to-orange-50/70 hover:from-amber-100/70 hover:to-orange-100/70 transition group shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700">
                    <PenLine className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-mono font-semibold text-neutral-900 group-hover:text-amber-800 transition">
                      Open Writing Studio
                    </p>
                    <p className="text-[10.5px] font-mono text-neutral-500">
                      Medium/Notion-style rich editor with live formatting
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-amber-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Launch →
                </span>
              </Link>

              <form onSubmit={handleAddPost} className="space-y-3 p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50">
                <p className="text-xs font-mono text-neutral-700 font-semibold">
                  Quick Publish to MongoDB
                </p>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-600 mb-1">
                    Post Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="e.g. Scaling Database Transactions at High Concurrency"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-600 mb-1">
                    Summary / Description
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={newPostDesc}
                    onChange={(e) => setNewPostDesc(e.target.value)}
                    placeholder="Brief description or takeaway..."
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-600 mb-1">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={newPostReadTime}
                      onChange={(e) => setNewPostReadTime(e.target.value)}
                      placeholder="e.g. 5 min read"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-600 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newPostTags}
                      onChange={(e) => setNewPostTags(e.target.value)}
                      placeholder="Node.js, Architecture"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingPost}
                  className="w-full mt-1 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono rounded-lg transition disabled:opacity-50"
                >
                  {submittingPost ? 'Saving...' : '+ Quick Publish'}
                </button>
              </form>

              {/* Existing Posts List */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-500">
                    Existing Posts ({posts.length})
                  </span>
                  <button
                    onClick={fetchPosts}
                    className="text-[11px] font-mono text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Refresh
                  </button>
                </div>

                {loadingPosts ? (
                  <div className="text-center py-4 text-xs font-mono text-neutral-400">
                    Loading posts...
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-6 text-xs font-mono text-neutral-400 border border-dashed rounded-xl">
                    No blog posts yet in MongoDB.
                  </div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post._id || post.title}
                      className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 flex items-start justify-between gap-2"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h5 className="text-xs font-mono font-semibold text-neutral-900">
                          {post.title}
                        </h5>
                        <p className="text-[11px] font-mono text-neutral-500 line-clamp-1">
                          {post.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Link
                          href={`/write?slug=${post.slug || post._id}`}
                          onClick={onClose}
                          className="p-1 text-neutral-400 hover:text-amber-700 transition"
                          title="Edit in Writing Studio"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        {post._id && (
                          <button
                            onClick={() => handleDeletePost(post._id!)}
                            className="p-1 text-neutral-400 hover:text-red-600 transition"
                            title="Delete from MongoDB"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'status' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                <h4 className="text-xs font-semibold text-neutral-900 font-sans">
                  Availability Status
                </h4>
                <p className="text-[11px] font-mono text-neutral-500">
                  Controls the green indicator badge on the portfolio:
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onToggleAvailability(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition ${
                      available
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium'
                        : 'bg-white text-neutral-600 border-neutral-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    Available for new projects
                  </button>

                  <button
                    onClick={() => onToggleAvailability(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition ${
                      !available
                        ? 'bg-neutral-800 text-white border-neutral-800 font-medium'
                        : 'bg-white text-neutral-600 border-neutral-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-neutral-400 inline-block" />
                    Busy / In Sprints
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                <h4 className="text-xs font-semibold text-neutral-900 font-sans">
                  Database Management
                </h4>
                <p className="text-[11px] font-mono text-neutral-500">
                  Reset collections back to Shefin&apos;s clean default state from the reference design.
                </p>
                <button
                  onClick={handleResetSeed}
                  className="px-3 py-2 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-lg text-xs font-mono transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-seed MongoDB Defaults</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1.5">
                <h4 className="text-xs font-semibold text-neutral-900 font-sans">
                  Architecture Overview
                </h4>
                <ul className="text-[11px] font-mono text-neutral-600 space-y-1">
                  <li>• Frontend: Next.js 16 + Tailwind CSS</li>
                  <li>• Backend: Express.js (Port 5001)</li>
                  <li>• Database: MongoDB (`shefin_portfolio`)</li>
                  <li>• Image: shefin.png</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50 text-center">
          <span className="text-[11px] font-mono text-neutral-400">
            MERN Stack Portfolio • Shefin
          </span>
        </div>
      </div>
    </div>
  );
}

