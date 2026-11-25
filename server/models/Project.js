const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Active', 'Sold', 'Building', 'Beta', 'Open Source', 'Archived'], 
    default: 'Active' 
  },
  iconKey: { type: String, default: 'code' },
  link: { type: String, default: '#' },
  sourceCode: { type: String, default: '' },
  github: { type: String, default: '' },
  tags: [{ type: String }],
  featured: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
