const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Profile = require('./models/Profile');
const Project = require('./models/Project');
const TechStack = require('./models/TechStack');
const ContactMessage = require('./models/ContactMessage');
const Post = require('./models/Post');
const Admin = require('./models/Admin');
const { seedDatabase, initialProfile, initialTechStack, initialProjects, initialPosts } = require('./seedData');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shefin_portfolio';
const JWT_SECRET = process.env.JWT_SECRET || 'shefin_secret_jwt_key_2026_super_secure';

// Auth verification middleware
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer storage for images, gifs, and videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${safeName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max for video/gif/images
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Database connection
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully at:', MONGO_URI);
    await seedDatabase();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Routes
// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1
  });
});

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' });
    }

    const cleanInput = emailOrUsername.trim();
    const admin = await Admin.findOne({
      $or: [
        { email: cleanInput.toLowerCase() },
        { username: cleanInput }
      ]
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email/username or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email/username or password' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', verifyAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ authenticated: true, admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// File upload endpoint for images, gifs, and videos
app.post('/api/upload', verifyAdmin, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `http://localhost:5001/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Profile endpoints
app.get('/api/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(initialProfile);
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message, fallback: initialProfile });
  }
});

app.put('/api/profile', verifyAdmin, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(req.body);
    } else {
      Object.assign(profile, req.body);
    }
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Projects endpoints
app.get('/api/projects', async (req, res) => {
  try {
    let projects = await Project.find().sort({ order: 1, createdAt: -1 });
    if (projects.length === 0) {
      projects = await Project.insertMany(initialProjects);
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message, fallback: initialProjects });
  }
});

app.post('/api/projects', verifyAdmin, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/projects/:id', verifyAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', verifyAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Tech stack endpoints
app.get('/api/tech-stack', async (req, res) => {
  try {
    let items = await TechStack.find().sort({ order: 1 });
    if (items.length === 0) {
      items = await TechStack.insertMany(initialTechStack);
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message, fallback: initialTechStack });
  }
});

app.put('/api/tech-stack', verifyAdmin, async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      await TechStack.deleteMany({});
      const items = await TechStack.insertMany(req.body);
      return res.json(items);
    }
    res.status(400).json({ error: 'Array of tech stack items expected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Contact message endpoints
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required' });
    }
    const newMessage = new ContactMessage({
      name: name || 'Visitor',
      email,
      message
    });
    await newMessage.save();
    res.status(201).json({
      success: true,
      message: 'Message received and stored in MongoDB! Thank you for reaching out.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Blog endpoints
app.get('/api/posts', async (req, res) => {
  try {
    let posts = await Post.find({ published: true }).sort({ order: 1, createdAt: -1 });
    if (posts.length === 0) {
      posts = await Post.insertMany(initialPosts);
    }
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message, fallback: initialPosts });
  }
});

app.get('/api/posts/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    let post = null;
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      post = await Post.findById(slugOrId);
    }
    if (!post) {
      post = await Post.findOne({ slug: slugOrId });
    }
    if (!post) {
      post = initialPosts.find(p => p.slug === slugOrId || p._id === slugOrId);
    }
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    const fallback = initialPosts.find(p => p.slug === req.params.slugOrId);
    if (fallback) return res.json(fallback);
    res.status(500).json({ error: error.message });
  }
});

// Helper to ensure a unique slug by appending incremental count (-1, -2, etc.)
async function generateUniqueSlug(baseText, existingPostId = null) {
  let baseSlug = (baseText || 'untitled')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'post';

  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug: candidate };
    if (existingPostId) {
      query._id = { $ne: existingPostId };
    }
    const exists = await Post.findOne(query);
    if (!exists) {
      return candidate;
    }
    candidate = `${baseSlug}-${counter}`;
    counter++;
  }
}

app.post('/api/posts', verifyAdmin, async (req, res) => {
  try {
    const postData = { ...req.body };
    const sourceForSlug = postData.slug || postData.title || 'untitled';
    postData.slug = await generateUniqueSlug(sourceForSlug);

    const post = new Post(postData);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    // Fallback if concurrent insert causes duplicate key error
    if (error.code === 11000) {
      try {
        const fallbackSlug = `${(req.body.slug || 'post')}-${Date.now().toString(36)}`;
        const fallbackPost = new Post({ ...req.body, slug: fallbackSlug });
        await fallbackPost.save();
        return res.status(201).json(fallbackPost);
      } catch (retryError) {
        return res.status(400).json({ error: retryError.message });
      }
    }
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/posts/:id', verifyAdmin, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.slug || updateData.title) {
      const sourceForSlug = updateData.slug || updateData.title;
      updateData.slug = await generateUniqueSlug(sourceForSlug, req.params.id);
    }
    const post = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/posts/:id', verifyAdmin, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Reset/Re-seed endpoint (Admin Protected)
app.post('/api/seed', verifyAdmin, async (req, res) => {
  try {
    await Profile.deleteMany({});
    await Project.deleteMany({});
    await TechStack.deleteMany({});
    await Post.deleteMany({});
    await seedDatabase();
    res.json({ success: true, message: 'Database reset and re-seeded!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Shefin Portfolio Express Server running on http://localhost:${PORT}`);
});

