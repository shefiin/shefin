'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { TechIcon } from './components/TechIcons';
import { SocialIcon } from './components/SocialIcons';
import { ProjectIcon } from './components/ProjectIcon';
import { EmailModal } from './components/EmailModal';
import { BookCallModal } from './components/BookCallModal';
import { AdminDrawer } from './components/AdminDrawer';
import { Database, ArrowUpRight } from 'lucide-react';

interface Project {
  _id?: string;
  title: string;
  description: string;
  status: 'Active' | 'Sold' | 'Building' | 'Beta' | 'Open Source' | string;
  iconKey: string;
  link?: string;
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
  socials: Array<{
    platform: string;
    url: string;
    iconKey: string;
  }>;
}

const defaultProfile: ProfileData = {
  name: 'Shefin',
  tagline: "Hey, I'm Shefin!",
  highlightWord: 'Shefin!',
  role: 'A freelance full-stack engineer based in Kerala, India',
  location: 'Kerala, India',
  countryFlag: '🇮🇳',
  specialization: 'React ecosystem',
  subtext: "If you need a reliable developer to build your product, I'm here to help.",
  available: true,
  availabilityText: "Available for new projects, let's talk!",
  email: 'shefin@example.com',
  calLink: 'https://cal.com/shefin',
  socials: [
    { platform: 'X/Twitter', url: 'https://x.com/shefinkp_', iconKey: 'twitter' },
    { platform: 'Threads', url: 'https://www.threads.net/@shefiiney', iconKey: 'threads' },
    { platform: 'Bluesky', url: 'https://bsky.app/profile/shefiin.bsky.social', iconKey: 'bluesky' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/shefin-kp/', iconKey: 'linkedin' },
    { platform: 'Substack', url: 'https://substack.com/@shefin204168', iconKey: 'substack' },
    { platform: 'GitHub', url: 'https://github.com/shefiin', iconKey: 'github' },
  ],
};

const defaultTechStack: TechItem[] = [
  { name: 'React', iconKey: 'react' },
  { name: 'Next.js', iconKey: 'nextjs' },
  { name: 'TanStack Start', iconKey: 'tanstack' },
  { name: 'TanStack Query', iconKey: 'tanstack' },
  { name: 'TypeScript', iconKey: 'typescript' },
  { name: 'Better Auth', iconKey: 'betterauth' },
  { name: 'Node', iconKey: 'node' },
  { name: 'Express', iconKey: 'express' },
  { name: 'Fastify', iconKey: 'fastify' },
  { name: 'Nest', iconKey: 'nest' },
  { name: 'Postgres', iconKey: 'postgres' },
  { name: 'MongoDB', iconKey: 'mongodb' },
  { name: 'Prisma', iconKey: 'prisma' },
  { name: 'Supabase', iconKey: 'supabase' },
  { name: 'Docker', iconKey: 'docker' },
  { name: 'Turborepo', iconKey: 'turborepo' },
  { name: 'shadcn/ui', iconKey: 'shadcn' },
  { name: 'Tailwind', iconKey: 'tailwind' },
  { name: 'AI SDK', iconKey: 'aisdk' },
];

const defaultProjects: Project[] = [
  {
    title: 'Project Y',
    description: 'My new project that I work on in stealth mode for now...',
    status: 'Active',
    iconKey: 'mic',
    link: 'https://projecty.dev',
  },
  {
    title: 'Listing Cat',
    description: 'Marketing database for startups and indie hackers.',
    status: 'Active',
    iconKey: 'cat',
    link: 'https://listingcat.com',
  },
  {
    title: 'Bluesky Meter',
    description: 'Realtime analytics for Bluesky social network.',
    status: 'Sold',
    iconKey: 'bluesky',
    link: 'https://blueskymeter.com',
  },
  {
    title: 'MERN Stack Suite',
    description: 'High performance web applications with Next.js, Express, and MongoDB.',
    status: 'Active',
    iconKey: 'database',
    link: 'https://github.com/shefiin',
  },
];

export default function Home() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [techStack, setTechStack] = useState<TechItem[]>(defaultTechStack);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);
  const [isMongoLive, setIsMongoLive] = useState(false);

  // Fetch data from Express + MongoDB backend
  const fetchData = async () => {
    try {
      // 1. Health check
      const healthRes = await fetch('http://localhost:5001/api/health');
      if (healthRes.ok) {
        setIsMongoLive(true);
      }

      // 2. Profile
      const profRes = await fetch('http://localhost:5001/api/profile');
      if (profRes.ok) {
        const profData = await profRes.json();
        setProfile(profData);
      }

      // 3. Projects
      const projRes = await fetch('http://localhost:5001/api/projects');
      if (projRes.ok) {
        const projData = await projRes.json();
        if (Array.isArray(projData) && projData.length > 0) {
          setProjects(projData);
        }
      }

      // 4. Tech Stack
      const techRes = await fetch('http://localhost:5001/api/tech-stack');
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

  // Keyboard shortcut listener: 'b' for Book, 'e' for Email
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        setIsBookModalOpen(true);
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setIsEmailModalOpen(true);
      } else if (e.key === 'Escape') {
        setIsBookModalOpen(false);
        setIsEmailModalOpen(false);
        setIsAdminDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleAvailability = async (val: boolean) => {
    setProfile((prev) => ({ ...prev, available: val }));
    try {
      await fetch('http://localhost:5001/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: val }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900 font-mono py-16 px-6 sm:px-8">
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
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Greeting & Name */}
        <h1 className="text-[26px] font-sans font-bold tracking-tight text-neutral-900 mb-5 leading-tight flex items-baseline gap-1.5 flex-wrap">
          <span>Hey, I&apos;m</span>
          <span className="text-[#d97706] border-b-2 border-[#f59e0b] pb-0.5">
            {profile.highlightWord || 'Shefin!'}
          </span>
        </h1>

        {/* Bio paragraphs in clean monospace */}
        <div className="space-y-2 text-[13.5px] text-neutral-800 leading-relaxed font-mono">
          <p>
            A freelance full-stack engineer based in {profile.location}{' '}
            <span className="inline-block">{profile.countryFlag}</span>
          </p>

          <p className="flex items-center gap-1.5 flex-wrap">
            <span>I specialize on building web applications with</span>
            <span className="inline-flex items-center gap-1 font-sans text-xs px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200/60 font-medium">
              <TechIcon name="react" className="w-3.5 h-3.5" />
              <span>React ecosystem.</span>
            </span>
          </p>

          <p className="text-neutral-700">
            {profile.subtext || "If you need a reliable developer to build your product, I'm here to help."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 mt-6 mb-3">
          <button
            onClick={() => setIsBookModalOpen(true)}
            className="group inline-flex items-center gap-2 bg-[#171717] hover:bg-neutral-800 text-white text-[13px] font-sans font-medium px-3.5 py-1.5 rounded-full shadow-xs transition-colors cursor-pointer"
          >
            <span className="bg-[#2e2e2e] text-neutral-300 text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold group-hover:bg-[#3d3d3d] transition">
              B
            </span>
            <span>Book a call</span>
          </button>

          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="group inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-[13px] font-sans font-medium px-3.5 py-1.5 rounded-full shadow-2xs transition-colors cursor-pointer"
          >
            <span className="bg-neutral-100 text-neutral-600 text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold border border-neutral-200/80">
              E
            </span>
            <span>Send an email</span>
          </button>
        </div>

        {/* Availability status */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 mb-12">
          {profile.available ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for new projects, let&apos;s talk!</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
              <span>Currently working with select clients</span>
            </>
          )}
        </div>

        {/* SECTION 1: TECH STACK */}
        <section className="mb-12">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium mb-2">
            TECH STACK
          </h2>
          <p className="text-xs font-mono text-neutral-700 mb-3.5">
            The tech stack I use for my personal and client work:
          </p>

          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200/80 bg-neutral-50/60 hover:bg-neutral-100/90 text-[12px] font-mono text-neutral-800 transition-colors shadow-2xs"
              >
                <TechIcon name={tech.iconKey || tech.name} className="w-3.5 h-3.5" />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: PROJECTS */}
        <section className="mb-12">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium mb-2">
            PROJECTS
          </h2>
          <p className="text-xs font-mono text-neutral-700 mb-3.5">
            These are my personal projects, both past and ongoing:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projects.map((project, idx) => {
              const isActive = project.status?.toLowerCase() === 'active';
              const isSold = project.status?.toLowerCase() === 'sold';

              return (
                <div
                  key={project._id || idx}
                  className="group border border-neutral-200 rounded-xl p-4 bg-white hover:border-neutral-300 transition-all shadow-2xs relative flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Icon + Title + Status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <ProjectIcon iconKey={project.iconKey} className="w-4 h-4 text-neutral-800" />
                        <h3 className="text-xs font-mono font-semibold text-neutral-900 group-hover:text-amber-700 transition">
                          {project.title}
                        </h3>
                      </div>

                      {/* Status Badge */}
                      {isActive && (
                        <span className="bg-[#eaf8f0] text-[#008744] border border-[#bdedd0] text-[10px] font-mono px-2 py-0.5 rounded-full font-medium">
                          Active
                        </span>
                      )}
                      {isSold && (
                        <span className="bg-[#fff1e5] text-[#b44800] border border-[#fed7aa] text-[10px] font-mono px-2 py-0.5 rounded-full font-medium">
                          Sold
                        </span>
                      )}
                      {!isActive && !isSold && (
                        <span className="bg-neutral-100 text-neutral-700 border border-neutral-200 text-[10px] font-mono px-2 py-0.5 rounded-full font-medium">
                          {project.status}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-[11.5px] font-mono text-neutral-500 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {project.link && project.link !== '#' && (
                    <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-end">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-neutral-400 hover:text-neutral-800 inline-flex items-center gap-0.5 transition"
                      >
                        <span>Visit</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: FIND ME ON */}
        <section className="mb-12">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium mb-2">
            FIND ME ON
          </h2>
          <p className="text-xs font-mono text-neutral-700 mb-3.5">
            You can find me on the following social platforms:
          </p>

          <div className="flex flex-wrap gap-2">
            {profile.socials.map((item) => (
              <a
                key={item.platform}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200/80 bg-neutral-50/60 hover:bg-neutral-100/90 text-[12px] font-mono text-neutral-800 transition-colors shadow-2xs"
              >
                <SocialIcon platform={item.platform} className="w-3.5 h-3.5" />
                <span>{item.platform}</span>
              </a>
            ))}
          </div>
        </section>

        {/* SECTION 4: GET IN TOUCH */}
        <section className="mb-14">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium mb-2">
            GET IN TOUCH
          </h2>
          <div className="space-y-1 text-xs font-mono text-neutral-700">
            <p>
              You can reach me anytime at{' '}
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="text-neutral-900 border-b-2 border-amber-400/90 hover:border-amber-500 pb-0.5 transition font-medium cursor-pointer"
              >
                {profile.email}
              </button>
            </p>
            <p>
              Or book a call on{' '}
              <button
                onClick={() => setIsBookModalOpen(true)}
                className="text-neutral-900 border-b-2 border-amber-400/90 hover:border-amber-500 pb-0.5 transition font-medium cursor-pointer"
              >
                Cal.com
              </button>
            </p>
          </div>
        </section>

        {/* MERN Stack Indicator & DB Panel trigger */}
        <div className="pt-8 border-t border-neutral-200/80 flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={() => setIsAdminDrawerOpen(true)}
            className="group inline-flex items-center gap-2 text-[11px] font-mono text-neutral-500 hover:text-neutral-900 px-2.5 py-1.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 transition shadow-2xs cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span>
              Stack: <strong className="font-semibold text-neutral-800">Next.js + Express + MongoDB</strong>
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${isMongoLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-[10px] text-neutral-400 group-hover:text-neutral-600">
              (Manage DB)
            </span>
          </button>

          <span className="text-[10px] font-mono text-neutral-400">
            Press <kbd className="px-1 py-0.5 bg-neutral-100 rounded text-neutral-600 border border-neutral-200">B</kbd> to Book • <kbd className="px-1 py-0.5 bg-neutral-100 rounded text-neutral-600 border border-neutral-200">E</kbd> to Email
          </span>
        </div>
      </div>

      {/* Modals & Drawers */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        recipientEmail={profile.email}
      />

      <BookCallModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        calLink={profile.calLink}
      />

      <AdminDrawer
        isOpen={isAdminDrawerOpen}
        onClose={() => setIsAdminDrawerOpen(false)}
        onDataRefresh={fetchData}
        available={profile.available}
        onToggleAvailability={handleToggleAvailability}
      />
    </main>
  );
}
