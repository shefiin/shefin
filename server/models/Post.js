const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, default: 'Nov 2026' },
  readTime: { type: String, default: '4 min read' },
  link: { type: String, default: 'https://substack.com/@shefin204168' },
  tags: [{ type: String }],
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
