'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Hash } from 'lucide-react';

export interface BlogPostData {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  readTime: string;
  tags?: string[];
  content?: string;
}

export const fallbackPosts: Record<string, BlogPostData> = {
  'designing-scalable-distributed-systems-nodejs-mongodb': {
    title: 'Designing Scalable Distributed Systems with Node.js & MongoDB',
    slug: 'designing-scalable-distributed-systems-nodejs-mongodb',
    description: 'Deep dive into idempotency, distributed locks, database indexing strategies, and failure isolation patterns in high-throughput services.',
    date: 'Nov 2026',
    readTime: '6 min read',
    tags: ['Distributed Systems', 'MongoDB', 'Node.js', 'Redis'],
    content: `When scaling distributed backend architectures handling thousands of concurrent requests, resilience depends on defensive system design: idempotency, robust distributed locking, database indexing strategies, and failure isolation.

### 1. Distributed Locks with Redis (Redlock)
In multi-node Node.js clusters, in-memory mutexes fail across instances. Race conditions during critical operations (such as payment double-spending or simultaneous appointment bookings) must be guarded using distributed locks with automatic TTLs:

\`\`\`javascript
// Acquire a distributed lock with automatic expiration
const lockKey = \`lock:consultation:\${consultationId}\`;
const acquired = await redis.set(lockKey, workerId, 'NX', 'PX', 5000);

if (!acquired) {
  throw new ConcurrencyConflictError('Another worker is currently processing this consultation');
}

try {
  await processConsultation(consultationId);
} finally {
  // Release lock only if we still own it (via Lua script)
  await redis.eval(releaseLockScript, 1, lockKey, workerId);
}
\`\`\`

### 2. MongoDB Compound Indexing & Cardinality
A frequent performance trap in document databases is unindexed sorting or poorly planned compound indexes. When querying across multiple tenants:
- **Equality** fields go first (e.g. \`organizationId\`)
- **Sort** keys second (e.g. \`createdAt\`)
- **Range** filters last (e.g. \`amount: { $gte: 100 }\`)

Following this ESR (Equality, Sort, Range) rule drops document scanning ratios from O(N) to O(log N) indexed tree seeks.

### 3. Graceful Degradation & Bulkheads
Never let external third-party API latency lock your Node event loop. Wrap slow dependencies with circuit breakers (e.g. Opossum) and set strict socket timeouts. When downstream services degrade, return cached or fallback states rather than exhausting connection pools.`
  },
  'fullstack-architecture-nextjs-express': {
    title: 'Fullstack Architecture: Why Next.js and Express Complement Each Other',
    slug: 'fullstack-architecture-nextjs-express',
    description: 'How decoupling Edge UI rendering from dedicated compute backend workers creates resilient, maintainable production environments.',
    date: 'Oct 2026',
    readTime: '5 min read',
    tags: ['Next.js', 'Express', 'System Design', 'Architecture'],
    content: `A common debate in the JavaScript ecosystem is whether Next.js can fully replace dedicated backend frameworks like Express. In enterprise and high-throughput architectures, pairing both offers distinct advantages.

### The Separation of Concerns
1. **Next.js as the Presentation & Edge Layer**:
   - Optimized for SSR, React Server Components (RSC), and edge-cached static assets.
   - Handles localized caching, SEO metadata, and zero-bundle-size server rendering.

2. **Express / Dedicated Node as the Compute & Domain Layer**:
   - Long-lived persistent connections (WebSockets, RabbitMQ, Kafka consumers).
   - Heavy background crunching, PDF generation, or image processing that would trigger serverless timeouts.
   - Fine-grained control over connection pooling with PostgreSQL and MongoDB replica sets.

\`\`\`text
Client Browser 
    │ (HTML / Static RSC)
    ▼
Next.js Frontend (Edge / CDN)
    │ (JSON / gRPC RPCs)
    ▼
Express API Worker (Docker / Node Cluster)
    │
    ├── PostgreSQL (ACID EHR Data)
    ├── MongoDB (Unstructured Telemetry)
    └── Redis (Session Cache)
\`\`\`

### Avoiding Serverless Connection Exhaustion
Serverless functions spawn hundreds of concurrent invocations under traffic spikes, easily exhausting database connection maximums. A containerized Express service manages connection pooling sustainably, buffering spikes with queuing mechanisms.`
  },
  'building-microservices-without-over-engineering': {
    title: 'Building Microservices Without Over-Engineering',
    slug: 'building-microservices-without-over-engineering',
    description: "A pragmatic software engineer's perspective on when to break monoliths, managing data boundaries, and event-driven communication.",
    date: 'Aug 2026',
    readTime: '4 min read',
    tags: ['Architecture', 'APIs', 'Microservices', 'Engineering'],
    content: `Microservices are often prematurely adopted, creating distributed monoliths where services are tightly coupled over slow HTTP REST interfaces. Here is a pragmatic blueprint for clean service boundaries.

### When to Actually Split Services
- **Autonomous Deployment Needs**: A compliance or billing service that changes rarely vs. a client UI gateway that deploys 20 times a day.
- **Heterogeneous Resource Demands**: A CPU-heavy medical imaging parser vs. an I/O-bound real-time chat service.
- **Strict Data Segregation**: Isolating HIPAA / PII data into an audited, restricted database enclave.

### Prefer gRPC for Synchronous Internal RPC
Inter-service HTTP/REST adds heavy JSON serialization and header parsing overhead. Switching internal service calls to **gRPC with Protocol Buffers** delivers:
- Typed binary payloads with backward and forward schema compatibility.
- HTTP/2 multiplexing over a single persistent TCP connection.
- 5x to 10x throughput gains over vanilla JSON-over-HTTP.

\`\`\`protobuf
syntax = "proto3";

service ConsultationService {
  rpc InitiateSession (SessionRequest) returns (SessionResponse);
}

message SessionRequest {
  string patient_id = 1;
  string doctor_id = 2;
  int64 timestamp = 3;
}
\`\`\`

### Asynchronous Event Streaming with NATS
For decoupled workflows like sending prescription notifications or audit logs, synchronous blocking calls degrade resilience. Utilizing a lightweight broker like NATS JetStream ensures delivery guarantees with sub-millisecond latencies.`
  }
};

// Formats inline markdown (bold, code)
function formatInlineText(text: string) {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold text-neutral-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="font-mono text-[12.5px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200/70"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

// Markdown parser component tailored to minimalist developer blog
function MarkdownBody({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block boundary
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // Close code block
        elements.push(
          <div key={`code-${i}`} className="my-5 rounded-xl overflow-hidden border border-neutral-200 bg-[#0d1117] text-[#c9d1d9] shadow-xs">
            {codeLang && (
              <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-b border-neutral-800 text-[11px] font-mono text-neutral-400">
                <span>{codeLang}</span>
              </div>
            )}
            <pre className="p-4 font-mono text-[12.5px] leading-relaxed overflow-x-auto text-neutral-200">
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        );
        codeLines = [];
        codeLang = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.replace('```', '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Heading 3
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-base font-sans font-bold text-neutral-900 tracking-tight mt-8 mb-2.5">
          {line.replace('### ', '')}
        </h3>
      );
      continue;
    }

    // Heading 2
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-lg font-sans font-bold text-neutral-900 tracking-tight mt-9 mb-3">
          {line.replace('## ', '')}
        </h2>
      );
      continue;
    }

    // Bullet list item
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={`li-${i}`} className="text-[13.5px] font-sans text-neutral-700 leading-relaxed ml-4 list-disc mb-1.5">
          {formatInlineText(line.substring(2))}
        </li>
      );
      continue;
    }

    // Numbered list item
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <div key={`num-${i}`} className="text-[13.5px] font-sans text-neutral-700 leading-relaxed ml-2 mb-2 flex items-start gap-2">
          <span className="font-mono text-neutral-400 shrink-0">{numMatch[1]}.</span>
          <div>{formatInlineText(numMatch[2])}</div>
        </div>
      );
      continue;
    }

    // Empty line
    if (!line.trim()) {
      continue;
    }

    // Paragraph
    elements.push(
      <p key={`p-${i}`} className="text-[14px] font-sans text-neutral-700 leading-relaxed mb-4">
        {formatInlineText(line)}
      </p>
    );
  }

  return <div className="article-body">{elements}</div>;
}

export default function ArticleView({ slug }: { slug: string }) {
  const initialPost = fallbackPosts[slug] || fallbackPosts['designing-scalable-distributed-systems-nodejs-mongodb'];
  const [post, setPost] = useState<BlogPostData>(initialPost);

  useEffect(() => {
    fetch(`http://localhost:5001/api/posts/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.title) {
          setPost(data);
        }
      })
      .catch(() => {});
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-800 antialiased selection:bg-neutral-200">
      <main className="max-w-[620px] mx-auto px-5 sm:px-6 pt-12 pb-20">
        {/* Navigation back */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-neutral-900 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Shefin / writing</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-6">
          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 mb-2.5">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 text-neutral-400" />
              {post.date}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-neutral-400" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-[26px] font-sans font-bold text-neutral-900 tracking-tight leading-snug mb-3">
            {post.title}
          </h1>

          <p className="text-[13.5px] font-mono text-neutral-500 leading-relaxed mb-4">
            {post.description}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200/70"
                >
                  <Hash className="w-2.5 h-2.5 text-neutral-400" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <hr className="border-neutral-200/80 mb-8" />

        {/* Article Body */}
        <article>
          <MarkdownBody content={post.content || ''} />
        </article>

        {/* Footer */}
        <hr className="border-neutral-200/80 my-10" />

        <div className="rounded-xl border border-neutral-200/80 bg-white p-4.5 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-mono font-medium text-neutral-900 mb-0.5">Written by Shefin</p>
              <p className="text-[11.5px] font-mono text-neutral-500 leading-relaxed">
                Software Engineer focused on full-stack systems, clean architecture, and scalable backends.
              </p>
            </div>
            <a
              href="mailto:shefinptr@gmail.com"
              className="text-[11px] font-mono text-neutral-600 hover:text-neutral-900 underline underline-offset-4 shrink-0 transition"
            >
              Email ↗
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to portfolio</span>
          </Link>

          <span className="text-[11px] text-neutral-400 font-mono">
            Kerala, India
          </span>
        </div>
      </main>
    </div>
  );
}

