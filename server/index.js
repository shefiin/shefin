const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Profile = require('./models/Profile');
const Project = require('./models/Project');
const TechStack = require('./models/TechStack');
const ContactMessage = require('./models/ContactMessage');
const { seedDatabase, initialProfile, initialTechStack, initialProjects } = require('./seedData');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shefin_portfolio';

// Middlewares
app.use(cors());
app.use(express.json());

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

app.put('/api/profile', async (req, res) => {
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

app.post('/api/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
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

// 6. Reset/Re-seed endpoint
app.post('/api/seed', async (req, res) => {
  try {
    await Profile.deleteMany({});
    await Project.deleteMany({});
    await TechStack.deleteMany({});
    await seedDatabase();
    res.json({ success: true, message: 'Database reset and re-seeded!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Shefin Portfolio Express Server running on http://localhost:${PORT}`);
});

