'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TechIcon } from './components/TechIcons';
import { SocialIcon } from './components/SocialIcons';
import { AdminDrawer } from './components/AdminDrawer';
import { verifyCurrentAuth, API_BASE_URL } from './utils/auth';
import { ArrowUpRight, ArrowRight, PenLine, User, FileText } from 'lucide-react';

interface Project {
  _id?: string;
  title: string;
  description?: string;
  status?: string;
  iconKey?: string;
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
  project?: string;
  seriesOrder?: number;
  content?: string;
}

interface TechItem {
  _id?: string;
  name: string;
  iconKey: string;
  category?: string;
}

interface ProfileData {
  name: string;
  tagline: string;
  highlightWord: string;
  role: string;
  location: string;
  countryFlag: string;
  specialization: string;
  subtext: string;
  available: boolean;
  availabilityText: string;
  email: string;
  calLink: string;
  cvUrl?: string;
  resumeUrl?: string;
  socials: Array<{
    platform: string;
    url: string;
    iconKey: string;
  }>;
}

const defaultProfile: ProfileData = {
  name: 'Shefin',
  tagline: "Hey, I'm Shefin",
  highlightWord: 'Shefin',
  role: 'Software Engineer based in Kerala, India',
  location: 'Kerala, India',
  countryFlag: '🇮🇳',
  specialization: 'Full-Stack Systems & Modern Architecture',
  subtext: "Focused on clean system architecture, scalable backends, databases, and building reliable software at scale.",
  available: true,
  availabilityText: "Open to engineering opportunities & collaborations",
  email: 'shefinptr@gmail.com',
  calLink: 'https://cal.com/shefin',
  cvUrl: '/Resume',
  resumeUrl: '/Resume',
  socials: [
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/shefin-kp/', iconKey: 'linkedin' },
    { platform: 'GitHub', url: 'https://github.com/shefiin', iconKey: 'github' },
    { platform: 'X', url: 'https://x.com/shefinkp_', iconKey: 'twitter' },
    { platform: 'Threads', url: 'https://www.threads.net/@shefiiney', iconKey: 'threads' },
    { platform: 'Bluesky', url: 'https://bsky.app/profile/shefiin.bsky.social', iconKey: 'bluesky' },
    { platform: 'Substack', url: 'https://substack.com/@shefin204168', iconKey: 'substack' },
  ],
};

const defaultTechStack: TechItem[] = [
  { name: 'Node.js', iconKey: 'node' },
  { name: 'Express', iconKey: 'express' },
  { name: 'MongoDB', iconKey: 'mongodb' },
  { name: 'PostgreSQL', iconKey: 'postgres' },
  { name: 'JavaScript', iconKey: 'javascript' },
  { name: 'TypeScript', iconKey: 'typescript' },
  { name: 'Next.js', iconKey: 'nextjs' },
  { name: 'React', iconKey: 'react' },
  { name: 'Docker', iconKey: 'docker' },
  { name: 'HTML5', iconKey: 'html' },
  { name: 'CSS3', iconKey: 'css' },
  { name: 'Tailwind', iconKey: 'tailwind' },
  { name: 'Supabase', iconKey: 'supabase' },
  { name: 'RabbitMQ', iconKey: 'rabbitmq' },
  { name: 'Kafka', iconKey: 'kafka' },
  { name: 'Redis', iconKey: 'redis' },
];

const defaultProjects: Project[] = [
  {
    title: 'CureHome — Telehealth platform',
    description: 'Production-ready distributed telehealth platform engineered for high availability, secure medical consultations, and real-time clinical workflows.',
    status: 'Active',
    iconKey: 'curehome',
    link: 'https://github.com/shefiin/telehealth',
    sourceCode: 'https://github.com/shefiin/telehealth',
    tags: [
      'Typescript',
      'react',
      'gRPC',
      'nats',
      'docker sandbox',
      'postgres',
      'mongodb',
      'redis',
      'prometheus',
      'grafana',
      'aws',
      'gcp',
      'kubernetes',
    ],
    bullets: [
      'Architected distributed microservices communicating via gRPC (Protobuf) for sub-millisecond inter-service RPCs and NATS JetStream for asynchronous pub/sub medical event streams and notification pipelines.',
      'Engineered secure multi-tenant Docker sandboxes with isolated Linux namespaces and resource limits to safely execute automated diagnostic triage algorithms without host contamination.',
      'Implemented a polyglot persistence tier pairing PostgreSQL for ACID-guaranteed patient health records (EHR) and financial billing with MongoDB for unstructured clinical notes, backed by Redis for sub-10ms session caching and distributed locking.',
      'Orchestrated containerized deployments via Kubernetes (K8s) across AWS and GCP, instrumenting Prometheus metrics scrapers and Grafana dashboards for real-time latency monitoring, health alerting, and SLO tracking.',
    ],
  },
];

const defaultPosts: BlogPost[] = [
  {
    title: 'Designing Scalable Distributed Systems with Node.js & MongoDB',
    slug: 'designing-scalable-distributed-systems-nodejs-mongodb',
    description: 'Deep dive into idempotency, distributed locks, database indexing strategies, and failure isolation patterns in high-throughput services.',
    date: 'Nov 2026',
    readTime: '6 min read',
    tags: ['Distributed Systems', 'MongoDB', 'Node.js'],
  },
  {
    title: 'Fullstack Architecture: Why Next.js and Express Complement Each Other',
    slug: 'fullstack-architecture-nextjs-express',
    description: 'How decoupling Edge UI rendering from dedicated compute backend workers creates resilient, maintainable production environments.',
    date: 'Oct 2026',
    readTime: '5 min read',
    tags: ['Next.js', 'Express', 'System Design'],
  },
  {
    title: 'Building Microservices Without Over-Engineering',
    slug: 'building-microservices-without-over-engineering',
    description: 'A pragmatic software engineer\'s perspective on when to break monoliths, managing data boundaries, and event-driven communication.',
    date: 'Aug 2026',
    readTime: '4 min read',
    tags: ['Architecture', 'APIs', 'Engineering'],
  },
];

export default function Home() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [techStack, setTechStack] = useState<TechItem[]>(defaultTechStack);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);
  const [isMongoLive, setIsMongoLive] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const checkAdminAuth = async () => {
    try {
      const { authenticated } = await verifyCurrentAuth();
      setIsAdminLoggedIn(authenticated);
    } catch {
      setIsAdminLoggedIn(false);
    }
  };

  // Fetch data from Express + MongoDB backend
  const fetchData = async () => {
    checkAdminAuth();
    try {
      // 1. Health check
      const healthRes = await fetch(`${API_BASE_URL}/api/health`);
      if (healthRes.ok) {
        setIsMongoLive(true);
      }

      // 2. Profile
      const profRes = await fetch(`${API_BASE_URL}/api/profile`);
      if (profRes.ok) {
        const profData = await profRes.json();
        setProfile(profData);
      }

      // 3. Projects
      const projRes = await fetch(`${API_BASE_URL}/api/projects`);
      if (projRes.ok) {
        const projData = await projRes.json();
        if (Array.isArray(projData) && projData.length > 0) {
          setProjects(projData);
        }
      }

      // 4. Blog Posts
      const postRes = await fetch(`${API_BASE_URL}/api/posts`);
      if (postRes.ok) {
        const postData = await postRes.json();
        if (Array.isArray(postData) && postData.length > 0) {
          setPosts(postData);
        }
      }

      // 5. Tech Stack
      const techRes = await fetch(`${API_BASE_URL}/api/tech-stack`);
      if (techRes.ok) {
        const techData = await techRes.json();
        if (Array.isArray(techData) && techData.length > 0) {
          setTechStack(techData);
        }
      }
    } catch {
      // Fallback data is already present
      setIsMongoLive(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Keyboard shortcut listener: Escape closes drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAdminDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleAvailability = async (val: boolean) => {
    setProfile((prev) => ({ ...prev, available: val }));
    try {
      await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: val }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900 font-mono py-16 px-6 sm:px-8">
      {/* Admin Profile & Actions (Top Right) */}
      {isAdminLoggedIn && (
        <div className="fixed top-5 right-5 sm:top-6 sm:right-6 z-40 group">
          {/* Main Trigger: Profile Icon (morphs to a dot when hovering) */}
          <div
            aria-label="Admin Profile Menu"
            className="w-9 h-9 rounded-full bg-white hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200/90 hover:border-neutral-300 shadow-2xs flex items-center justify-center transition-all duration-150 cursor-pointer"
          >
            <User className="w-4 h-4 text-neutral-600 group-hover:hidden transition-all" />
            <span className="hidden group-hover:block w-1.5 h-1.5 rounded-full bg-neutral-500 transition-all" />
          </div>

          {/* Hover Dropdown: 1. Profile icon, 2. Pencil icon */}
          <div className="absolute right-0 top-full pt-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 flex flex-col gap-1.5 items-center">
            {/* 1. Profile Icon (opens Profile page) */}
            <Link
              href="/profile"
              aria-label="Profile"
              title="Profile"
              className="w-9 h-9 rounded-full bg-white hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200/90 hover:border-neutral-300 shadow-2xs flex items-center justify-center transition-all duration-150"
            >
              <User className="w-4 h-4 text-neutral-600" />
            </Link>

            {/* 2. Pencil Icon (opens Writing Studio) */}
            <Link
              href="/write"
              aria-label="Writing Studio"
              title="Writing Studio"
              className="w-9 h-9 rounded-full bg-white hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200/90 hover:border-neutral-300 shadow-2xs flex items-center justify-center transition-all duration-150"
            >
              <PenLine className="w-4 h-4 text-neutral-600" />
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-[620px] mx-auto">
        {/* Profile Avatar */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-200/80 shadow-2xs">
            <Image
              src="/shefin.png"
              alt="Shefin"
              width={48}
              height={48}
              priority
              unoptimized
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Greeting & Name */}
        <h1 className="text-[26px] font-sans font-bold tracking-tight text-neutral-900 mb-6 leading-tight flex items-baseline gap-1.5 flex-wrap">
          <span>Hey, I&apos;m</span>
          <span className="text-[#d97706] border-b-2 border-[#f59e0b] pb-0.5">
            {(profile.highlightWord || 'Shefin').replace(/!+$/, '')}
          </span>
        </h1>

        {/* FIND ME ON (Directly after Hey Shefin) */}
        <section className="mb-9">
          {/* <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium mb-2.5">
            FIND ME ON
          </h2> */}
          <div className="flex flex-wrap items-center gap-1.5">
            {profile.socials
              .filter((item) => !['email', 'gmail', 'mail'].includes(item.platform.toLowerCase()))
              .map((item) => (
                <a
                  key={item.platform}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-neutral-200/80 bg-neutral-50/60 hover:bg-neutral-100/90 text-[12px] font-mono text-neutral-800 transition-colors shrink-0"
                >
                  <SocialIcon platform={item.platform} className="w-3.5 h-3.5" />
                  <span>{item.platform}</span>
                </a>
              ))}
            <a
              href={profile.resumeUrl || profile.cvUrl || '/Resume'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-neutral-200/80 bg-neutral-50/60 hover:bg-neutral-100/90 text-[12px] font-mono text-neutral-800 transition-colors shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-neutral-700" />
              <span>Resume</span>
            </a>
          </div>
        </section>

        {/* SECTION 1: PROJECTS */}
        <section className="mb-12">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium mb-3">
            PROJECTS
          </h2>

          <div className="space-y-4">
            {projects.map((project, idx) => (
              <div
                key={project._id || idx}
                className="space-y-2.5"
              >
                {/* Title & Source Code Link Below */}
                <div>
                  <h3 className="text-[13.5px] font-mono font-semibold text-neutral-900">
                    {project.title}
                  </h3>

                  {project.sourceCode && (
                    <div className="mt-1">
                      <a
                        href={project.sourceCode}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-500 hover:text-neutral-900 text-[11.5px] font-mono transition underline underline-offset-2 decoration-neutral-300 hover:decoration-neutral-600 inline-flex items-center gap-0.5"
                      >
                        <span>source code: {project.sourceCode}</span>
                        <ArrowUpRight className="w-3 h-3 text-neutral-400 inline" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Tech Stack Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10.5px] font-mono px-2 py-[1.5px] leading-tight rounded-md bg-neutral-100/80 text-neutral-700 border border-neutral-200/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bullet Points */}
                {project.bullets && project.bullets.length > 0 && (
                  <div className="pt-1.5">
                    <ul className="space-y-2 text-[12px] font-mono text-neutral-700 leading-relaxed">
                      {project.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold select-none shrink-0 leading-5">▹</span>
                          <span className="flex-1">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: WRITING */}
        <section className="mb-12">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium mb-3">
            WRITING
          </h2>

          <div className="space-y-3">
            {posts.map((post, idx) => {
              const postSlug = post.slug || (idx === 0
                ? 'designing-scalable-distributed-systems-nodejs-mongodb'
                : idx === 1
                  ? 'fullstack-architecture-nextjs-express'
                  : 'building-microservices-without-over-engineering');

              return (
                <Link
                  key={post._id || post.slug || idx}
                  href={`/writing/${postSlug}`}
                  className="group block border border-neutral-200 rounded-xl p-4 bg-white hover:border-neutral-300 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 text-[10.5px] font-mono text-neutral-400">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-800 group-hover:translate-x-0.5 transition" />
                  </div>

                  <h3 className="text-xs font-mono font-semibold text-neutral-900 group-hover:text-amber-700 transition leading-snug mb-1">
                    {post.title}
                  </h3>

                  <p className="text-[11.5px] font-mono text-neutral-500 leading-relaxed">
                    {post.description}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-neutral-100">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-1.5 py-[1px] leading-tight rounded bg-neutral-100/70 text-neutral-600 border border-neutral-200/50"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
            <Link
              href="/writing"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-600 hover:text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 pb-0.5 transition group"
            >
              <span>View all writings & project series ({posts.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* SECTION 3: TECH STACK */}
        <section className="mb-12">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium mb-3">
            TECH STACK
          </h2>

          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="inline-flex items-center gap-1.5 px-2.5 py-[2px] leading-tight rounded-md border border-neutral-200/80 bg-neutral-50/60 hover:bg-neutral-100/90 text-[11.5px] font-mono text-neutral-800 transition-colors"
              >
                <TechIcon name={tech.iconKey || tech.name} className="w-3.5 h-3.5" />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: GET IN TOUCH */}
        <section className="mb-14">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium mb-3">
            GET IN TOUCH
          </h2>
          <div className="space-y-1 text-xs font-mono text-neutral-700">
            <p>
              Connect via{' '}
              <a
                href={`mailto:${profile.email}`}
                className="text-neutral-900 border-b-2 border-amber-400/90 hover:border-amber-500 pb-0.5 transition font-medium cursor-pointer"
              >
                {profile.email}
              </a>
            </p>
            <p>
              Or via{' '}
              <a
                href="https://www.linkedin.com/in/shefin-kp/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 border-b-2 border-amber-400/90 hover:border-amber-500 pb-0.5 transition font-medium cursor-pointer"
              >
                LinkedIn
              </a>
            </p>
          </div>
        </section>
      </div >

      {/* MongoDB Management Drawer */}
      < AdminDrawer
        isOpen={isAdminDrawerOpen}
        onClose={() => setIsAdminDrawerOpen(false)
        }
        onDataRefresh={fetchData}
        available={profile.available}
        onToggleAvailability={handleToggleAvailability}
      />
    </main >
  );
}
