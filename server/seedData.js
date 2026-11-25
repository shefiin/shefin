const Profile = require('./models/Profile');
const Project = require('./models/Project');
const TechStack = require('./models/TechStack');
const Post = require('./models/Post');

const initialProfile = {
  name: "Shefin",
  tagline: "Hey, I'm Shefin",
  highlightWord: "Shefin",
  role: "Software Engineer based in Kerala, India",
  location: "Kerala, India",
  countryFlag: "🇮🇳",
  specialization: "Full-Stack Systems & Modern Architecture",
  email: "shefinptr@gmail.com",
  calLink: "https://cal.com/shefin",
  socials: [
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/shefin-kp/", iconKey: "linkedin" },
    { platform: "GitHub", url: "https://github.com/shefiin", iconKey: "github" },
    { platform: "X", url: "https://x.com/shefinkp_", iconKey: "twitter" },
    { platform: "Threads", url: "https://www.threads.net/@shefiiney", iconKey: "threads" },
    { platform: "Bluesky", url: "https://bsky.app/profile/shefiin.bsky.social", iconKey: "bluesky" },
    { platform: "Substack", url: "https://substack.com/@shefin204168", iconKey: "substack" }
  ]
};

const initialTechStack = [
  { name: "Node.js", iconKey: "node", category: "Backend", order: 1 },
  { name: "Express", iconKey: "express", category: "Backend", order: 2 },
  { name: "MongoDB", iconKey: "mongodb", category: "Database", order: 3 },
  { name: "PostgreSQL", iconKey: "postgres", category: "Database", order: 4 },
  { name: "JavaScript", iconKey: "javascript", category: "Frontend", order: 5 },
  { name: "TypeScript", iconKey: "typescript", category: "Frontend", order: 6 },
  { name: "Next.js", iconKey: "nextjs", category: "Frontend", order: 7 },
  { name: "React", iconKey: "react", category: "Frontend", order: 8 },
  { name: "Docker", iconKey: "docker", category: "Tools", order: 9 },
  { name: "HTML5", iconKey: "html", category: "Frontend", order: 10 },
  { name: "CSS3", iconKey: "css", category: "Frontend", order: 11 },
  { name: "Tailwind", iconKey: "tailwind", category: "Frontend", order: 12 },
  { name: "Supabase", iconKey: "supabase", category: "Database", order: 13 },
  { name: "RabbitMQ", iconKey: "rabbitmq", category: "Backend", order: 14 },
  { name: "Kafka", iconKey: "kafka", category: "Backend", order: 15 },
  { name: "Redis", iconKey: "redis", category: "Database", order: 16 }
];

const initialProjects = [
  {
    title: "CureHome — Telehealth platform",
    description: "Production-ready distributed telehealth platform engineered for high availability, secure medical consultations, and real-time clinical workflows.",
    status: "Active",
    iconKey: "curehome",
    link: "https://github.com/shefiin/telehealth",
    sourceCode: "https://github.com/shefiin/telehealth",
    tags: [
      "Typescript",
      "react",
      "gRPC",
      "nats",
      "docker sandbox",
      "postgres",
      "mongodb",
      "redis",
      "prometheus",
      "grafana",
      "aws",
      "gcp",
      "kubernetes"
    ],
    bullets: [
      "Architected distributed microservices communicating via gRPC (Protobuf) for sub-millisecond inter-service RPCs and NATS JetStream for asynchronous pub/sub medical event streams and notification pipelines.",
      "Engineered secure multi-tenant Docker sandboxes with isolated Linux namespaces and resource limits to safely execute automated diagnostic triage algorithms without host contamination.",
      "Implemented a polyglot persistence tier pairing PostgreSQL for ACID-guaranteed patient health records (EHR) and financial billing with MongoDB for unstructured clinical notes, backed by Redis for sub-10ms session caching and distributed locking.",
      "Orchestrated containerized deployments via Kubernetes (K8s) across AWS and GCP, instrumenting Prometheus metrics scrapers and Grafana dashboards for real-time latency monitoring, health alerting, and SLO tracking."
    ],
    order: 1
  }
];

const initialPosts = [
  {
    title: "Designing Scalable Distributed Systems with Node.js & MongoDB",
    slug: "designing-scalable-distributed-systems-nodejs-mongodb",
    description: "Deep dive into idempotency, distributed locks, database indexing strategies, and failure isolation patterns in high-throughput services.",
    date: "Nov 2026",
    readTime: "6 min read",
    tags: ["Distributed Systems", "MongoDB", "Node.js"],
    content: `When scaling Node.js backends beyond single-server workloads, common bottlenecks shift from CPU saturation to data tier coordination, distributed concurrency, and failure blast radiuses.

### 1. The Idempotency Imperative
In distributed systems, networks fail, clients retry, and load balancers duplicate HTTP frames. Designing every mutation endpoint to be idempotent prevents devastating double-charging or duplicate record generation.

We achieve this by passing a client-generated \`Idempotency-Key\` header through Redis with short TTLs:
\`\`\`typescript
async function processPayment(idempotencyKey: string, payload: PaymentData) {
  const acquired = await redis.set(\`lock:idemp:\${idempotencyKey}\`, "1", "NX", "EX", 60);
  if (!acquired) {
    throw new DuplicateRequestError("Request already in flight or processed");
  }
  // Proceed with safe database transaction
}
\`\`\`

### 2. MongoDB Compound Indexing & Cardinality
A frequent performance trap in document databases is unindexed sorting or poorly planned compound indexes. When querying across multiple tenants:
- **Equality** fields go first (e.g. \`organizationId\`)
- **Sort** keys second (e.g. \`createdAt\`)
- **Range** filters last (e.g. \`amount: { $gte: 100 }\`)

Following this ESR (Equality, Sort, Range) rule drops document scanning ratios from O(N) to O(log N) indexed tree seeks.

### 3. Graceful Degradation & Bulkheads
Never let external third-party API latency lock your Node event loop. Wrap slow dependencies with circuit breakers (e.g. Opossum) and set strict socket timeouts. When downstream services degrade, return cached or fallback states rather than exhausting connection pools.`,
    order: 1
  },
  {
    title: "Fullstack Architecture: Why Next.js and Express Complement Each Other",
    slug: "fullstack-architecture-nextjs-express",
    description: "How decoupling Edge UI rendering from dedicated compute backend workers creates resilient, maintainable production environments.",
    date: "Oct 2026",
    readTime: "5 min read",
    tags: ["Next.js", "Express", "System Design"],
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
Serverless functions spawn hundreds of concurrent invocations under traffic spikes, easily exhausting database connection maximums. A containerized Express service manages connection pooling sustainably, buffering spikes with queuing mechanisms.`,
    order: 2
  },
  {
    title: "Building Microservices Without Over-Engineering",
    slug: "building-microservices-without-over-engineering",
    description: "A pragmatic software engineer's perspective on when to break monoliths, managing data boundaries, and event-driven communication.",
    date: "Aug 2026",
    readTime: "4 min read",
    tags: ["Architecture", "APIs", "Engineering"],
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
For decoupled workflows like sending prescription notifications or audit logs, synchronous blocking calls degrade resilience. Utilizing a lightweight broker like NATS JetStream ensures delivery guarantees with sub-millisecond latencies.`,
    order: 3
  }
];

async function seedDatabase() {
  try {
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      await Profile.create(initialProfile);
      console.log('🌱 Seeded initial profile');
    }

    const techCount = await TechStack.countDocuments();
    if (techCount === 0) {
      await TechStack.insertMany(initialTechStack);
      console.log(`🌱 Seeded ${initialTechStack.length} tech stack items`);
    }

    // Ensure projects only has the single CureHome project
    await Project.deleteMany({});
    await Project.insertMany(initialProjects);
    console.log(`🌱 Seeded ${initialProjects.length} single CureHome project with bullets`);

    // Ensure posts has internal blog posts with rich content
    await Post.deleteMany({});
    await Post.insertMany(initialPosts);
    console.log(`🌱 Seeded ${initialPosts.length} internal blog posts with full content`);
  } catch (error) {
    console.error('Seed error:', error);
  }
}

module.exports = {
  seedDatabase,
  initialProfile,
  initialTechStack,
  initialProjects,
  initialPosts
};
