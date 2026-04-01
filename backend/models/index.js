const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// ─── Admin User ───────────────────────────────────────────────────────────────
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
}, { timestamps: true })

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

adminSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

// ─── About ────────────────────────────────────────────────────────────────────
const aboutSchema = new mongoose.Schema({
  name: { type: String, default: 'Your Name' },
  title: { type: String, default: 'AI/ML Engineer' },
  tagline: { type: String, default: 'Building the future with AI' },
  description: { type: String, default: '' },
  email: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  avatar: { type: String, default: '' },
}, { timestamps: true })

// ─── Site Settings ────────────────────────────────────────────────────────────
const siteSettingsSchema = new mongoose.Schema({
  backgroundImage: { type: String, default: '' },
}, { timestamps: true })

// ─── Project ──────────────────────────────────────────────────────────────────
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'Other' },
  description: { type: String, default: '' },
  techStack: [{ type: String }],
  image: { type: String, default: '' },
  images: [{ type: String }],
  github: { type: String, default: '' },
  live: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true })

// ─── Skill ────────────────────────────────────────────────────────────────────
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['AI/ML', 'Data Analysis', 'Programming', 'Tools', 'Other'],
    default: 'Other',
  },
  order: { type: Number, default: 0 },
}, { timestamps: true })

// ─── Achievement ──────────────────────────────────────────────────────────────
const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  images: [{ type: String }],
  tags: [{ type: String }],
  order: { type: Number, default: 0 },
}, { timestamps: true })

// ─── Workshop ─────────────────────────────────────────────────────────────────
const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, default: '' },
  location: { type: String, default: '' },
  attendees: { type: Number, default: 0 },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  images: [{ type: String }],
  tags: [{ type: String }],
  order: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = {
  Admin: mongoose.model('Admin', adminSchema),
  About: mongoose.model('About', aboutSchema),
  SiteSettings: mongoose.model('SiteSettings', siteSettingsSchema),
  Project: mongoose.model('Project', projectSchema),
  Skill: mongoose.model('Skill', skillSchema),
  Achievement: mongoose.model('Achievement', achievementSchema),
  Workshop: mongoose.model('Workshop', workshopSchema),
}
