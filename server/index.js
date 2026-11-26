const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
require('dotenv').config();

const Profile = require('./models/Profile');
const Project = require('./models/Project');
const TechStack = require('./models/TechStack');
const ContactMessage = require('./models/ContactMessage');
const Post = require('./models/Post');
const Admin = require('./models/Admin');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shefin_portfolio';
const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || (isProduction ? null : 'shefin_dev_jwt_secret_local_only');

if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is required in production.');
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false
  })
);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' }
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages sent. Please wait a few minutes before trying again.' }
});

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

const verifyAdmin = (req, res, next) => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (!safeMethods.includes(req.method)) {
    const origin = req.headers.origin;
    if (isProduction && origin && !allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: 'CSRF Protection: Request origin not permitted' });
    }
  }

  let token = req.cookies?.admin_token;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF images are permitted.'));
    }
  }
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || !isProduction) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json());


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully at:', MONGO_URI);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1
  });
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (typeof emailOrUsername !== 'string' || typeof password !== 'string' || !emailOrUsername.trim() || !password) {
      return res.status(400).json({ error: 'Valid email/username and password strings are required' });
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

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

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
    res.status(500).json({ error: isProduction ? 'Authentication failed' : error.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/'
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/auth/me', verifyAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ authenticated: true, admin });
  } catch (error) {
    res.status(500).json({ error: isProduction ? 'Failed to retrieve profile' : error.message });
  }
});

app.post('/api/upload', verifyAdmin, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'portfolio',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Failed to upload image to media store' });
        }

        res.json({
          success: true,
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          resource_type: result.resource_type,
          bytes: result.bytes
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/profile', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/profile', verifyAdmin, async (req, res) => {
  try {
    const { name, title, bio, location, email, github, linkedin, twitter, website, avatarUrl, resumeUrl, available } = req.body;
    const allowedUpdates = { name, title, bio, location, email, github, linkedin, twitter, website, avatarUrl, resumeUrl, available };
    Object.keys(allowedUpdates).forEach(key => allowedUpdates[key] === undefined && delete allowedUpdates[key]);

    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(allowedUpdates);
    } else {
      Object.assign(profile, allowedUpdates);
    }
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', verifyAdmin, async (req, res) => {
  try {
    const { title, description, status, iconKey, link, sourceCode, github, tags, bullets, featured, order } = req.body;
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Project title is required' });
    }
    const project = new Project({
      title: title.trim(),
      description: typeof description === 'string' ? description : '',
      status: ['Active', 'Sold', 'Building', 'Beta', 'Open Source', 'Archived'].includes(status) ? status : 'Active',
      iconKey: iconKey || 'curehome',
      link: link || '#',
      sourceCode: sourceCode || '',
      github: github || '',
      tags: Array.isArray(tags) ? tags.map(t => String(t).trim()).filter(Boolean) : [],
      bullets: Array.isArray(bullets) ? bullets.map(b => String(b).trim()).filter(Boolean) : [],
      featured: typeof featured === 'boolean' ? featured : true,
      order: typeof order === 'number' ? order : 0
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/projects/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, description, tags, githubUrl, liveUrl, featured, order } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, tags, githubUrl, liveUrl, featured, order },
      { new: true, runValidators: true }
    );
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

app.get('/api/tech-stack', async (req, res) => {
  try {
    const items = await TechStack.find().sort({ order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tech-stack', verifyAdmin, async (req, res) => {
  try {
    if (Array.isArray(req.body) && req.body.length > 0) {
      const sanitized = req.body.map((item, idx) => {
        if (!item.name || !item.iconKey) {
          throw new Error(`Item at index ${idx} is missing required 'name' or 'iconKey'`);
        }
        return {
          name: String(item.name).trim(),
          category: ['Frontend', 'Backend', 'Database', 'Tools', 'All'].includes(item.category) ? item.category : 'All',
          iconKey: String(item.iconKey).trim(),
          highlight: Boolean(item.highlight),
          order: typeof item.order === 'number' ? item.order : idx + 1
        };
      });

      await TechStack.deleteMany({});
      const items = await TechStack.insertMany(sanitized);
      return res.json(items);
    }
    res.status(400).json({ error: 'Non-empty array of tech stack items expected' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required' });
    }
    const newMessage = new ContactMessage({
      name: (name || 'Visitor').slice(0, 100),
      email: email.slice(0, 150),
      message: message.slice(0, 5000)
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

app.get('/api/contact', verifyAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const query = { published: true };
    if (req.query.project && typeof req.query.project === 'string') {
      query.project = String(req.query.project).trim();
    }
    const posts = await Post.find(query).sort({ order: 1, seriesOrder: 1, createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    if (!post && /^[a-zA-Z0-9_-]{3,64}$/.test(slugOrId)) {
      const escaped = slugOrId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      post = await Post.findOne({ slug: new RegExp(`-${escaped}$`, 'i') });
    }
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function generateShortId(length = 6) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

async function generateUniqueSlug(baseText, existingPostId = null) {
  let cleanText = (baseText || 'untitled')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'post';

  const hasUniqueId = /-[a-z0-9]{6}$/.test(cleanText);
  let baseSlug = hasUniqueId ? cleanText.slice(0, -7) : cleanText;
  let candidate = hasUniqueId ? cleanText : `${cleanText}-${generateShortId(6)}`;

  while (true) {
    const query = { slug: candidate };
    if (existingPostId) {
      query._id = { $ne: existingPostId };
    }
    const exists = await Post.findOne(query);
    if (!exists) {
      return candidate;
    }
    candidate = `${baseSlug}-${generateShortId(6)}`;
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

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ error: err.message || 'An error occurred processing the request' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`🚀 Shefin Portfolio Express Server running on http://localhost:${PORT}`);
});
