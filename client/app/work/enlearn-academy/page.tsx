import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const caseStudySections = [
  {
    number: '01',
    title: 'Layered Modular Architecture & Repository Pattern',
    problem:
      'Controllers directly queried Mongoose models, and middleware was tightly coupled to feature schemas, creating circular dependencies and un-testable business logic.',
    solution: [
      'Refactored all 10 core modules (auth, courses, leads, cms, blogs, etc.) into a strict 5-tier pipeline: Route → Controller → Service → Repository → Model.',
      'Inverted dependencies between authentication middleware and user models using runtime lookup providers (configureAuthUserLookup).',
      'Added automated architectural boundary linting via dependency-cruiser (npm run arch:check) to fail CI builds on direct controller-to-model imports or cross-module repository leaks.',
      'Isolated business logic with Vitest unit tests mocking repository and caching layers.'
    ],
    impact:
      '0 circular dependencies and 0 architectural violations across 101 TypeScript modules; 100% unit-test execution without live database instances.'
  },
  {
    number: '02',
    title: 'Transactional Outbox Pattern & Phone Deduplication',
    problem:
      'Lead capture (POST /api/leads) ran synchronous Google Sheets API syncs and Excel generation inside the HTTP request loop, causing ~3.07s response times and duplicate lead creation on repeat submissions.',
    solution: [
      'Transactional Outbox: Decoupled external syncs. The API writes the lead record and an atomic OutboxEvent (status: pending) to MongoDB, returning HTTP 201 in under 160ms.',
      'Resilient Background Worker: A dedicated worker atomically claims events (findOneAndUpdate), syncs Google Sheets and Excel asynchronously, auto-recovers stale locks (>2 min), and retries failures with exponential backoff (5s → 10s → 20s → 40s → 80s).',
      '30-Day Silent Deduplication: Checked incoming phone numbers via findRecentLeadByPhoneInDB(phone, 30). Existing leads have their course interest updated silently without generating duplicate rows or redundant external webhook calls.'
    ],
    impact:
      'Response latency dropped from 3,075 ms to 150 ms (~20x speedup); eliminated duplicate rows across MongoDB and Google Sheets.'
  },
  {
    number: '03',
    title: 'Fail-Open Redis Cache-Aside Layer',
    problem:
      'High-traffic public endpoints (/api/courses, /api/cms, /api/blogs) made repeated database queries on every page hit for data that rarely changed.',
    solution: [
      'Integrated a fail-open ioredis cache-aside client (getOrSetCache, invalidateCache). If Redis crashes or times out, the service safely falls back to MongoDB with zero user-facing downtime.',
      'Configured 5–15 minute TTLs on public reads with automated, non-blocking SCAN-based prefix invalidation triggered on admin mutations (create, update, delete).'
    ],
    impact:
      'GET /api/cms improved from 90.5 ms to 36.3 ms (~2.5x faster); GET /api/courses improved from 122.4 ms to 56.9 ms (~2.1x faster).'
  },
  {
    number: '04',
    title: 'Rotating Refresh Tokens & Family Replay Detection',
    problem:
      'Admin portal previously relied on static long-lived JWTs without server-side revocation or token theft detection.',
    solution: [
      'Implemented single-use refresh tokens stored in secure HttpOnly cookies, mapped to a familyId in Redis.',
      'Built automatic token-family replay revocation: if an already-invalidated refresh token is reused, the entire token family is immediately purged from Redis, the user tokenVersion increments in MongoDB, and all active sessions are terminated.'
    ],
    impact:
      'Closed session hijacking attack vectors with automated replay detection and instantaneous session revocation.'
  },
  {
    number: '05',
    title: 'Structured Logging & Distributed Correlation (pino)',
    problem:
      'Unstructured console.log statements made debugging concurrent requests and error tracking impossible on production VPS logs.',
    solution: [
      'Replaced native logging with pino and pino-http.',
      'Injected unique crypto.randomUUID() request correlation IDs via X-Request-ID across every HTTP lifecycle.',
      'Configured automatic field redaction for sensitive keys (authorization, cookie, password).'
    ],
    impact:
      'Traceable request lifecycles across concurrent workloads with sanitized, JSON-structured output.'
  },
  {
    number: '06',
    title: 'Frontend SSR/ISR & BFF Architecture',
    problem:
      'Modular landing page sections fired redundant parallel calls to /api/cms and /api/courses, while public pages suffered from layout shifts due to client-side useEffect data fetching.',
    solution: [
      'TanStack Query Request Deduplication: Unified concurrent component queries into single in-flight network requests with a 5-minute memory cache.',
      'Server Components & ISR: Converted /blogs and /books to Server Components with Incremental Static Regeneration (revalidate = 300), serving pre-rendered HTML without client-side loading spinners.',
      'BFF Proxy: Added a Next.js API catch-all proxy with centralized fetchWithAuth interceptors for seamless 401 background token refresh and optimistic UI updates on admin actions.'
    ],
    impact:
      'Eliminated duplicate homepage API waterfalls and client-side loading spinners on public content pages.'
  }
];

const stack = [
  'Next.js',
  'Express',
  'TypeScript',
  'MongoDB',
  'Redis',
  'PM2',
  'Hostinger VPS'
];

export default function EnlearnCaseStudyPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 font-mono py-16 px-6 sm:px-8 selection:bg-amber-100">
      <div className="max-w-[620px] mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </Link>

          <a
            href="https://enlearnacademy.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 pb-0.5 transition"
          >
            <span>enlearnacademy.com</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Header */}
        <header className="mb-10">
          <div className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium mb-2">
            Case Study · Freelance Work
          </div>
          <h1 className="text-2xl sm:text-[26px] font-sans font-bold text-neutral-900 tracking-tight leading-snug mb-3">
            Enlearn Academy
          </h1>
          <p className="text-xs text-neutral-600 leading-relaxed mb-4">
            Lead generation platform, admin panel with lead collection, custom mini CRM, and CMS — built with a layered repository architecture and asynchronous outbox workers.
          </p>

          <div className="flex flex-wrap gap-1.5">
            {stack.map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-1.5 py-[1px] rounded bg-neutral-100 text-neutral-600 border border-neutral-200/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* Case Study Sections */}
        <div className="space-y-8">
          {caseStudySections.map((section) => (
            <section
              key={section.number}
              className="space-y-2.5 pb-6 border-b border-neutral-100 last:border-b-0"
            >
              <h2 className="text-sm font-sans font-semibold text-neutral-900">
                {section.title}
              </h2>

              <div className="space-y-2.5 text-[11.5px] leading-relaxed">
                <div>
                  <span className="font-semibold text-neutral-800">Problem: </span>
                  <span className="text-neutral-600">{section.problem}</span>
                </div>

                <div>
                  <span className="font-semibold text-neutral-800 block mb-1">
                    Implementation:
                  </span>
                  <ul className="space-y-1 text-neutral-600 list-disc pl-4">
                    {section.solution.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-neutral-100">
                  <span className="font-semibold text-neutral-800">Impact: </span>
                  <span className="text-neutral-700">{section.impact}</span>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

