const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Shefin' },
  tagline: { type: String, default: "Hey, I'm Shefin!" },
  highlightWord: { type: String, default: "Shefin!" },
  role: { type: String, default: "A freelance full-stack engineer" },
  location: { type: String, default: "Kerala, India" },
  countryFlag: { type: String, default: "🇮🇳" },
  specialization: { type: String, default: "React & Next.js ecosystem" },
  subtext: { type: String, default: "If you need a reliable developer to build your product, I'm here to help." },
  available: { type: Boolean, default: true },
  availabilityText: { type: String, default: "Available for new projects, let's talk!" },
  email: { type: String, default: "shefin@example.com" },
  calLink: { type: String, default: "https://cal.com/shefin" },
  socials: [
    {
      platform: { type: String, required: true },
      url: { type: String, required: true },
      iconKey: { type: String, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);

