# Shefin • Minimalist Developer Portfolio

A developer portfolio built with **Next.js (App Router)**, **Express.js**, and **MongoDB (Mongoose)**, faithfully matching the clean design reference.

## 🚀 Features

- **Pixel-Perfect Aesthetic**: Clean typography, monospace accents, subtle borders, soft badges, and minimalist layout.
- **Profile Image**: Powered by `shefin.png` in a circular avatar container.
- **Tech Stack Pills**: 19+ tech badges with custom SVG icons (React, Next.js, Express, MongoDB, TypeScript, Tailwind, Docker, etc.).
- **Interactive Projects Showcase**: Cards featuring live status tags (`Active`, `Sold`), icons, descriptions, and direct visit links.
- **Working MERN Backend**:
  - **Express Server**: RESTful API running on port `5001`.
  - **MongoDB Database**: Connected at `mongodb://127.0.0.1:27017/shefin_portfolio` with collections for `profiles`, `projects`, `techstacks`, and `contactmessages`.
  - **Auto-Seeding**: Initial data automatically populated into MongoDB on startup.
- **Interactive Keyboard Shortcuts**:
  - Press <kbd>B</kbd> anywhere to open the **Book a call** modal (15-min, 30-min, or direct Cal.com calendar).
  - Press <kbd>E</kbd> anywhere to open the **Send an email** modal (stores submitted notes directly in MongoDB).
  - Press <kbd>Esc</kbd> to dismiss modals.
- **MongoDB Control Drawer**: Click **Stack: Next.js + Express + MongoDB** at the bottom to view the MongoDB inbox, add new projects live, or toggle project availability.

---

## 🛠️ Project Structure

```
shefin/
├── client/                     # Next.js 16 + Tailwind CSS frontend
│   ├── app/
│   │   ├── components/
│   │   │   ├── AdminDrawer.tsx # MongoDB inspector & project manager
│   │   │   ├── BookCallModal.tsx
│   │   │   ├── EmailModal.tsx  # Direct MongoDB message submission
│   │   │   ├── ProjectIcon.tsx
│   │   │   ├── SocialIcons.tsx
│   │   │   └── TechIcons.tsx   # Crisp SVGs for all tech stack items
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx            # Main portfolio layout
│   └── public/
│       └── shefin.png          # Shefin's avatar image
├── server/                     # Express.js API + MongoDB (Mongoose)
│   ├── models/
│   │   ├── ContactMessage.js
│   │   ├── Profile.js
│   │   ├── Project.js
│   │   └── TechStack.js
│   ├── index.js                # Express API endpoints
│   ├── seedData.js             # Initial seed data
│   └── .env                    # PORT=5001, MONGO_URI
├── package.json                # Root package runner with concurrently
└── shefin.png
```

---

## 🏃 Running the Application

### 1. Start Both Frontend and Backend Concurrently
From the root folder:
```bash
npm run dev
```
- **Next.js Frontend**: [http://localhost:3000](http://localhost:3000)
- **Express Backend**: [http://localhost:5001](http://localhost:5001)

### 2. Independent Commands
- Run Server only: `npm run dev:server` (or `node server/index.js`)
- Run Client only: `npm run dev:client` (or `cd client && npm run dev`)
- Production Build: `npm run build`

---

## 📡 API Endpoints (Express & MongoDB)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server and MongoDB connection status |
| `GET` | `/api/profile` | Fetches Shefin's profile & bio |
| `PUT` | `/api/profile` | Updates profile data / availability |
| `GET` | `/api/projects` | Retrieves list of projects from MongoDB |
| `POST` | `/api/projects` | Adds a new project to MongoDB |
| `GET` | `/api/tech-stack` | Retrieves tech stack list |
| `POST` | `/api/contact` | Submits and saves message into MongoDB |
| `GET` | `/api/contact` | Retrieves all messages stored in MongoDB |
| `POST` | `/api/seed` | Resets & re-seeds MongoDB with defaults |

