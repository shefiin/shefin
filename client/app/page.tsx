'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { TechIcon } from './components/TechIcons';
import { SocialIcon } from './components/SocialIcons';
import { ProjectIcon } from './components/ProjectIcon';
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
  role: 'Software Engineer based in Kerala, India',
  location: 'Kerala, India',
  countryFlag: '🇮🇳',
  specialization: 'Full-Stack Systems & Modern Architecture',
  subtext: "Focused on clean system architecture, scalable backends, databases, and building reliable software at scale.",
  available: true,
  availabilityText: "Open to engineering opportunities & collaborations",
  email: 'shefin@example.com',
  calLink: 'https://cal.com/shefin',
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
        <div className="space-y-2.5 text-[13.5px] text-neutral-800 leading-relaxed font-mono">
          <p>
            Software Engineer based in {profile.location}{' '}
            <span className="inline-block">{profile.countryFlag}</span>
          </p>

          <p>
            I engineer end-to-end web applications, robust backend APIs, and distributed systems across the modern TypeScript, Node, and database ecosystem.
          </p>

          <p className="text-neutral-600">
            {profile.subtext || "Focused on clean system architecture, scalable backends, databases, and building reliable software at scale."}
          </p>
        </div>

        {/* Availability status */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 mt-5 mb-12">
          {profile.available ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{profile.availabilityText || "Open to engineering opportunities & collaborations"}</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
              <span>Currently focused on core engineering systems</span>
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
              You can reach me directly at{' '}
              <a
                href={`mailto:${profile.email}`}
                className="text-neutral-900 border-b-2 border-amber-400/90 hover:border-amber-500 pb-0.5 transition font-medium cursor-pointer"
              >
                {profile.email}
              </a>
            </p>
            <p>
              Or connect via{' '}
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
            Shefin • Software Engineer
          </span>
        </div>
      </div>

      {/* MongoDB Management Drawer */}
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
