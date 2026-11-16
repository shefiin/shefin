const mongoose = require('mongoose');

const techStackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Frontend', 'Backend', 'Database', 'Tools', 'All'], 
    default: 'All' 
  },
  iconKey: { type: String, required: true },
  highlight: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('TechStack', techStackSchema);

