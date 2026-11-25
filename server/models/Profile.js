const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Shefin' },
  tagline: { type: String, default: "Hey, I'm Shefin!" },
  highlightWord: { type: String, default: "Shefin!" },
  role: { type: String, default: "Software Engineer" },
  location: { type: String, default: "Kerala, India" },
  countryFlag: { type: String, default: "🇮🇳" },
  specialization: { type: String, default: "Full-Stack Systems & Modern Architecture" },
  subtext: { type: String, default: "Focused on clean architecture, scalable backends, databases, and reliable software." },
  available: { type: Boolean, default: true },
  availabilityText: { type: String, default: "Open to engineering opportunities & collaborations" },
  email: { type: String, default: "shefinptr@gmail.com" },
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

