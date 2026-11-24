const Profile = require('./models/Profile');
const Project = require('./models/Project');
const TechStack = require('./models/TechStack');
const Post = require('./models/Post');

const initialProfile = {
  name: "Shefin",
  tagline: "Hey, I'm Shefin!",
  highlightWord: "Shefin!",
  role: "Software Engineer based in Kerala, India",
  location: "Kerala, India",
  countryFlag: "🇮🇳",
  specialization: "Full-Stack Systems & Modern Architecture",
  email: "shefin@example.com",
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
    title: "Project Y",
    description: "My new project that I work on in stealth mode for now...",
    status: "Active",
    iconKey: "mic",
    link: "https://projecty.dev",
    order: 1
  },
  {
    title: "Listing Cat",
    description: "Marketing database for startups and indie hackers.",
    status: "Active",
    iconKey: "cat",
    link: "https://listingcat.com",
    order: 2
  },
  {
    title: "Bluesky Meter",
    description: "Realtime analytics for Bluesky social network.",
    status: "Sold",
    iconKey: "bluesky",
    link: "https://blueskymeter.com",
    order: 3
  },
  {
    title: "MERN Stack Suite",
    description: "High performance web applications with Next.js, Express, and MongoDB.",
    status: "Active",
    iconKey: "database",
    link: "https://github.com/shefiin",
    order: 4
  }
];

const initialPosts = [
  {
    title: "Designing Scalable Distributed Systems with Node.js & MongoDB",
    description: "Deep dive into idempotency, distributed locks, database indexing strategies, and failure isolation patterns in high-throughput services.",
    date: "Nov 2026",
    readTime: "6 min read",
    link: "https://substack.com/@shefin204168",
    tags: ["Distributed Systems", "MongoDB", "Node.js"],
    order: 1
  },
  {
    title: "Fullstack Architecture: Why Next.js and Express Complement Each Other",
    description: "How decoupling Edge UI rendering from dedicated compute backend workers creates resilient, maintainable production environments.",
    date: "Oct 2026",
    readTime: "5 min read",
    link: "https://substack.com/@shefin204168",
    tags: ["Next.js", "Express", "System Design"],
    order: 2
  },
  {
    title: "Building Microservices Without Over-Engineering",
    description: "A pragmatic software engineer's perspective on when to break monoliths, managing data boundaries, and event-driven communication.",
    date: "Aug 2026",
    readTime: "4 min read",
    link: "https://substack.com/@shefin204168",
    tags: ["Architecture", "APIs", "Engineering"],
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
      console.log('🌱 Seeded initial tech stack');
    }

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(initialProjects);
      console.log('🌱 Seeded initial projects');
    }

    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      await Post.insertMany(initialPosts);
      console.log('🌱 Seeded initial blog posts');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = { seedDatabase, initialProfile, initialTechStack, initialProjects, initialPosts };

