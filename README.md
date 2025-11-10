# 🧮 Algorithm Visualizer

[![License](https://img.shields.io/badge/license-Academic-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgres-%3E%3D15-blue.svg)](https://www.postgresql.org/)

## 🧭 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Technologies Used](#️-technologies-used)
- [Setup Guide (Local Build)](#-setup-guide-local-build)
- [Project Metadata](#-project-metadata)
- [Team](#-team)
- [Upcoming Plans](#-upcoming-plans)
- [License](#-license)

---

## 💡 About the Project

**Algorithm Visualizer** is designed to make learning algorithms more interactive and engaging.

It lets students visualize sorting, searching, and graph algorithms step by step — with options to pause, control speed, and add personal notes.

The app also introduces gamification, letting users build learning streaks, compete on leaderboards, and track personal progress.

---

## ✨ Features

### 🎬 Algorithm Visualizations

- **Sorting**: Bubble, Quick, Merge, Insertion, Heap
- **Searching**: Linear, Binary
- **Graph**: BFS, DFS, Dijkstra
- **Pathfinding** (A*, Maze) - *Planned*

### 🕹️ Gamification

- Daily streak tracking
- Leaderboards based on engagement
- Progress history and resume tracking

### 🧠 User Features

- Secure authentication (JWT-based)
- Personalized notes for each algorithm
- Profile with learning statistics
- Algorithm theory/material pages

### 💅 UI/UX

- Fully responsive layout
- Smooth animations with Framer Motion
- Modern design using Tailwind CSS

---

## 🛠️ Technologies Used

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, TailwindCSS, D3.js, Framer Motion, React Router |
| **Backend** | Node.js, Express.js, Sequelize ORM, JWT Authentication |
| **Database** | PostgreSQL |
| **Dev Tools** | Git, GitHub, Jest, Mocha/Chai |
| **(Planned Deployment)** | Netlify (Frontend), Render/Railway (Backend + DB) |

---

## 🧰 Setup Guide (Local Build)

This guide helps you run the project locally.

*(Deployment is planned but not yet live.)*

### 🔧 Prerequisites

- **Node.js** ≥ 20.0.0 → [Download here](https://nodejs.org/)
- **PostgreSQL** ≥ 15 → [Download here](https://www.postgresql.org/download/)
- **Git** → [Download here](https://git-scm.com/downloads)

### 🪜 Step 1: Clone the Repository

```bash
git clone https://github.com/Anushka8178/algoVisualiser.git
cd algoVisualiser
```

### 📦 Step 2: Install Dependencies

**Frontend:**

```bash
npm install
```

**Backend:**

```bash
cd backend
npm install
```

### 🗄️ Step 3: Set Up Database

1. Open PostgreSQL (psql) or pgAdmin
2. Run these commands:

```sql
CREATE DATABASE algovisualizer;
```

3. Note down your:
   - Username (usually `postgres`)
   - Password
   - Host (`localhost`)
   - Port (`5432`)

### ⚙️ Step 4: Configure the Backend

1. Go to the backend folder:

```bash
cd backend
```

2. Create a new `.env` file:

```env
DB_NAME=algovisualizer
DB_USER=postgres
DB_PASS=your_postgres_password
DB_HOST=localhost
PORT=5000
JWT_SECRET=your_random_secret_key_here
```

💡 **Generate a secret key easily:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> 📝 **Note:** You can also copy `backend/ENV_EXAMPLE.txt` and rename it to `.env`, then fill in your values.

### 🚀 Step 5: Run the App

You'll need **two terminals**:

#### 🖥️ Terminal 1 — Backend

```bash
cd backend
npm run dev
```

✅ **Wait for:**

```
Database connected ✅
Server running on port 5000
```

#### 🌐 Terminal 2 — Frontend

```bash
cd algoVisualiser  # (project root)
npm run dev
```

✅ **Wait for:**

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**Now open 👉 [http://localhost:5173](http://localhost:5173) in your browser!**

### 🧠 Step 6: Test It Out

- 📝 **Register** → Create a test account
- 🔑 **Login** → Access your dashboard
- 🧮 **Visualize Algorithms** → See step-by-step animations
- ✍️ **Add Notes** → Save personal insights
- 🏆 **Track Progress** → Watch streaks grow!

---

## 🧩 Common Issues

| Error | Solution |
|-------|----------|
| Cannot connect to DB | Ensure PostgreSQL is running and `.env` is correct |
| Port 5000 in use | Change `PORT=5001` in `.env` |
| JWT Secret not defined | Add `JWT_SECRET` to `.env` and restart backend |
| Blank frontend page | Refresh or check console errors |
| Module not found | Run `npm install` again |

---

## 🧾 Quick Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server (frontend/backend) |
| `npm start` | Start backend in production mode |
| `npm run build` | Build frontend for production |
| `psql -U postgres` | Access PostgreSQL terminal |

---

## 📊 Project Metadata

```yaml
app:
  name: Algorithm Visualizer
  version: 1.0.0-MVP
  status: Development (Local Build)
  build_date: 2025-11-08
  platform: Web
  access_modes:
    - local
    - (planned) online

online:
  status: pending_deployment
  planned_platforms:
    frontend: Netlify (or Vercel)
    backend: Render (or Railway)
    database: PostgreSQL Cloud (Render/Supabase)

local:
  frontend:
    url: http://localhost:5173
    port: 5173
    framework: Vite + React
  backend:
    url: http://localhost:5000
    api_prefix: /api
    port: 5000
    framework: Node.js + Express
  database:
    type: PostgreSQL
    host: localhost
    port: 5432
    name: algovisualizer
    user: postgres
    password_env: DB_PASS

repository:
  platform: GitHub
  url: https://github.com/Anushka8178/algoVisualiser.git
  default_branch: main
  access: public

team:
  project_code: 23CSE311
  course: Software Engineering
  institution: Amrita School of Computing, Amritapuri
  department: Computer Science and Engineering

features:
  algorithms:
    - Sorting (Bubble, Merge, Quick, Insertion, Heap)
    - Searching (Linear, Binary)
    - Graph (BFS, DFS, Dijkstra)
    - Pathfinding (A*, Maze) - planned
  visualization:
    engine: D3.js
    controls: Play, Pause, Step, Speed (0.5x–2x)
    metrics: Time & Space Complexity (Big-O)
  gamification:
    streak: daily_learning
    leaderboard: global_rank_by_streak_and_engagement
  notes:
    per_algorithm: true
    operations: create, read, update, delete
  progress:
    save_resume: true
    history: true
  ui:
    responsive: true
    frameworks: Tailwind CSS, Framer Motion

tech:
  frontend:
    - React.js
    - Vite
    - Tailwind CSS
    - D3.js
    - Framer Motion
  backend:
    - Node.js
    - Express.js
    - Sequelize ORM
    - JWT Authentication
  database:
    - PostgreSQL
  devops:
    - Git + GitHub
    - (planned) Netlify or Vercel
    - (planned) Render or Railway
    - Testing: Jest, Mocha/Chai
```

---

## 👥 Team

| Member | ID | Role |
|--------|-----|------|
| **Anushka Das** | AM.SC.U4CSE23108 | Project Lead / Full-Stack |
| **Revathi V** | AM.SC.U4CSE23145 | Backend Developer |
| **Pavithra Nair** | AM.SC.U4CSE23141 | Gamification & Testing Lead |
| **Meghna Binod** | AM.SC.U4CSE23135 | Frontend & Database Administrator |

**Contact:**
- Email: algoviz.cse@amrita.edu
- GitHub: [@Anushka8178](https://github.com/Anushka8178)

---

## 🚀 Upcoming Plans

- [ ] Pathfinding algorithms (A*, Maze generation)
- [ ] Online deployment (Netlify + Render)
- [ ] Additional sorting algorithms
- [ ] User preferences and settings
- [ ] Export/import notes
- [ ] Dark mode
- [ ] Mobile app (React Native)

---

## 📄 License

This project is part of an academic assignment for **Software Engineering (23CSE311)** at **Amrita School of Computing, Amritapuri**.

---

## 📚 Additional Documentation

- **[SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)** - Detailed step-by-step setup guide
- **[QUICK_START.md](QUICK_START.md)** - Quick reference guide
- **[PROJECT_METADATA.md](PROJECT_METADATA.md)** - Technical documentation
- **[START_HERE.md](START_HERE.md)** - Getting started guide

---

## 🆘 Getting Help

If you encounter issues:

1. Check the [Common Issues](#-common-issues) section above
2. Review [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed troubleshooting
3. Check the terminal/console for error messages
4. Verify all prerequisites are installed correctly
5. Ensure both frontend and backend are running

---

**Happy Learning! 🚀**

*Made with ❤️ by Team Algorithm Visualizer*
