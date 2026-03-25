# 🌌 Universe Portfolio — Full Stack

A visually stunning, futuristic portfolio with an animated universe particle background, fully dynamic content, and a complete admin control panel.

## ✨ Features

- **Universe Particle Background** — 180 particles with depth, glow, nebulae, and mouse interaction via Canvas API
- **Custom Cursor** — Dot + ring cursor with smooth lag and click effects
- **6 Sections** — Hero, Skills, Projects (with modal), Achievements (carousel), Workshops, Contact
- **Admin Panel** — JWT-secured dashboard with full CRUD for all sections
- **Image Uploads** — Cloudinary (production) or local disk (dev fallback)
- **React + Tailwind + Framer Motion** — Smooth animations throughout
- **Node.js + Express + MongoDB** — Robust REST API

---

## 📁 Folder Structure

```
portfolio/
├── frontend/                   # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── UniverseBackground.jsx   ← Canvas particle system
│   │   │   ├── Cursor.jsx               ← Custom cursor
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── admin/
│   │   │   │   └── CrudManager.jsx      ← Reusable CRUD UI
│   │   │   └── sections/
│   │   │       ├── HeroSection.jsx
│   │   │       ├── SkillsSection.jsx
│   │   │       ├── ProjectsSection.jsx
│   │   │       ├── AchievementsSection.jsx
│   │   │       ├── WorkshopsSection.jsx
│   │   │       └── ContactSection.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Portfolio.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminAbout.jsx
│   │   │       ├── AdminSkills.jsx
│   │   │       ├── AdminProjects.jsx
│   │   │       ├── AdminAchievements.jsx
│   │   │       ├── AdminWorkshops.jsx
│   │   │       └── AdminSettings.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/                    # Node.js + Express + MongoDB
    ├── models/
    │   └── index.js            ← All Mongoose schemas
    ├── routes/
    │   ├── auth.js
    │   ├── about.js
    │   ├── projects.js
    │   ├── skills.js
    │   ├── achievements.js
    │   ├── workshops.js
    │   ├── upload.js
    │   └── crudFactory.js      ← Generic CRUD route generator
    ├── middleware/
    │   └── auth.js             ← JWT protect middleware
    ├── server.js
    ├── seed.js
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### 1. Clone and install

```bash
# Backend
cd portfolio/backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_very_long_secret_key_here_min_32_chars
ADMIN_EMAIL=admin@yourportfolio.com
ADMIN_PASSWORD=yourStrongPassword123
FRONTEND_URL=http://localhost:5173

# Optional — Cloudinary for image hosting
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

This creates:
- Your admin account
- Sample projects, skills, achievements, workshops

### 4. Start development servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev        # Starts on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev        # Starts on http://localhost:5173
```

### 5. Access the app

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | Portfolio (public) |
| `http://localhost:5173/admin` | Admin login |
| `http://localhost:5173/admin/dashboard` | Admin dashboard |

**Default credentials:**
- Email: `admin@portfolio.com`
- Password: `admin123`
- ⚠️ Change these immediately via Settings!

---

## 🌐 API Reference

### Public Endpoints (no auth required)
```
GET  /api/about
GET  /api/projects
GET  /api/skills
GET  /api/achievements
GET  /api/workshops
GET  /api/health
```

### Protected Endpoints (JWT required)
```
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/change-password

PUT    /api/about

POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id

POST   /api/skills
PUT    /api/skills/:id
DELETE /api/skills/:id

POST   /api/achievements
PUT    /api/achievements/:id
DELETE /api/achievements/:id

POST   /api/workshops
PUT    /api/workshops/:id
DELETE /api/workshops/:id

POST   /api/upload
```

---

## 🎨 Customization Guide

### Change Colors
Edit `frontend/tailwind.config.js` → `theme.extend.colors`:
```js
aurora:   '#06b6d4',  // Primary — cyan
pulsar:   '#8b5cf6',  // Secondary — violet
nova:     '#f472b6',  // Accent — pink
```

### Adjust Particles
Edit `frontend/src/components/UniverseBackground.jsx`:
```js
const PARTICLE_COUNT = 180        // More = denser, heavier
const CONNECTION_DIST = 120       // Connection line distance
const MOUSE_RADIUS = 150          // Mouse repulsion zone
```

### Add Skill Categories
Edit `frontend/src/components/sections/SkillsSection.jsx`:
```js
const CATEGORY_CONFIG = {
  'Your Category': { color: '#hex', glow: 'rgba(r,g,b,0.2)', icon: '🔥' },
}
```

### Personal Info
Run seed once, then update via the Admin Panel → Hero/About.

---

## 🚢 Deployment

### Frontend — Vercel

```bash
cd frontend
npm run build

# Deploy to Vercel
npx vercel --prod

# Set env variable in Vercel dashboard:
VITE_API_URL=https://your-backend.railway.app
```

Update `frontend/src/utils/api.js`:
```js
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })
```

### Backend — Railway / Render

```bash
# Push to GitHub, then connect repo to Railway or Render
# Set these environment variables in the dashboard:

PORT=5000
MONGODB_URI=mongodb+srv://...  (MongoDB Atlas connection string)
JWT_SECRET=your_secret
FRONTEND_URL=https://your-portfolio.vercel.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### MongoDB Atlas (free tier)
1. Go to https://cloud.mongodb.com
2. Create a free M0 cluster
3. Create a user and get the connection string
4. Replace `MONGODB_URI` in your backend env

---

## ⚙️ Additional Dependencies to Install

```bash
# Frontend — if react-scroll causes issues, install:
npm install react-scroll

# Backend — verify all installed:
npm install bcryptjs cors dotenv express jsonwebtoken mongoose multer cloudinary multer-storage-cloudinary express-rate-limit helmet nodemon
```

---

## 🔒 Security Checklist

- [ ] Change default admin password after first login
- [ ] Use a strong `JWT_SECRET` (32+ random characters)
- [ ] Set `MONGODB_URI` to Atlas in production (not localhost)
- [ ] Configure `FRONTEND_URL` to your exact Vercel domain
- [ ] Enable Cloudinary for persistent image storage
- [ ] Remove the `.env.example` credentials notice from production

---

## 🎯 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Animation | Framer Motion, Canvas API (particles) |
| Routing | React Router v6 |
| HTTP | Axios |
| Auth | JWT (jsonwebtoken) |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose |
| Images | Cloudinary / Local multer |
| Security | Helmet, express-rate-limit, bcryptjs |

---

Built with ❤️ — Go make it yours! 🚀
