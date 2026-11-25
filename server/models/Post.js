const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  content: { type: String, default: '' },
  date: { type: String, default: 'Nov 2026' },
  readTime: { type: String, default: '4 min read' },
  tags: [{ type: String }],
  project: { type: String, default: '' },
  seriesOrder: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
