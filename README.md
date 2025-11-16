#  Algorithm Visualizer


##  Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Technologies Used](#️-technologies-used)
- [Set up locally](#setup-guide-local-build)
- [Project Metadata](#-project-metadata)
- [Team](#-team)

---

## 💡 About the Project

**Algorithm Visualizer** is designed to make learning algorithms more interactive and engaging.

It lets students visualize sorting, searching, and graph algorithms step by step — with options to pause, control speed, and add personal notes.

The app also introduces gamification, letting users build learning streaks, compete on leaderboards, and track personal progress.

---

## ✨ Features

### Algorithm Visualizations

- **Sorting**: Bubble, Quick, Merge, Insertion, Heap
- **Searching**: Linear, Binary
- **Graph**: BFS, DFS, Dijkstra, Topological Sort
- **Dynamic D3.js Visualizations**: Educators can add custom algorithm visualizations
- **More algorithms like pathfinding, linked list etc** - *Planned*

### Student Features

- Request algorithms from educators
- View algorithm visualizations with interactive controls
- Access learning materials and resources (PDFs, links)
- Receive messages from educators
- Track daily learning streaks
- View leaderboard rankings
- Save personal notes for each algorithm
- Progress history and statistics

### Educator Features

- View and manage student algorithm requests
- Add new algorithms with custom D3.js visualizations
- Edit and delete published algorithms
- Upload learning resources (PDFs, text links)
- Send messages to students
- Mark requests as completed
- View student progress and engagement

### Gamification

- Daily streak tracking with email notifications
- Leaderboards based on engagement (educators excluded)
- Progress history and resume tracking
- Achievement system

### UI/UX

- Fully responsive layout
- Smooth animations with Framer Motion
- Modern design using Tailwind CSS
- Separate interfaces for students and educators
- Dark/Light theme support

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

##  Setup Guide (Local Build)

This guide helps you run the project locally.

*(Deployment is planned but not yet live.)*

### 🔧 Prerequisites

- **Node.js** ≥ 20.0.0 → [Download here](https://nodejs.org/)
- **PostgreSQL** ≥ 15 → [Download here](https://www.postgresql.org/download/)
- **Git** → [Download here](https://git-scm.com/downloads)

###  Step 1: Clone the Repository

```bash
git clone https://github.com/Anushka8178/algoVisualiser.git
cd algoVisualiser
```

### Step 2: Install Dependencies

**Frontend:**

```bash
npm install
```

**Backend:**

```bash
cd backend
npm install
```

###  Step 3: Set Up Database

**Option A: Automatic Setup (Recommended)**

```bash
cd backend
npm run setup-db
```

This will automatically:
- Check if `.env` file exists (create if missing)
- Verify PostgreSQL connection
- Create database if it doesn't exist
- Test the connection

**Option B: Manual Setup**

1. Open PostgreSQL (psql) or pgAdmin
2. Run these commands:

```sql
CREATE DATABASE algodb;
-- OR
CREATE DATABASE algovisualizer;
```

3. Note down your:
   - Username (usually `postgres`)
   - Password
   - Host (`localhost` or `127.0.0.1`)
   - Port (`5432` or `5433`) 

###  Step 4: Configure the Backend

1. Go to the backend folder:

```bash
cd backend
```

2. Create a new `.env` file:

```env
DB_NAME=algodb
DB_USER=postgres
DB_PASS=your_postgres_password
DB_HOST=127.0.0.1
DB_PORT=5433
PORT=5000
JWT_SECRET=your_random_secret_key_here

# Email Configuration (Optional - for streak notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

** To generate a secret key easily:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> ** You can also copy `backend/ENV_EXAMPLE.txt` and rename it to `.env`, then fill in your values.

###  Step 5: Run the App

You'll need **two terminals**:

####  Terminal 1 — Backend

```bash
cd backend
npm run dev
```

 **Wait for:**

```
Database connected ✅
Server running on port 5000
```

####  Terminal 2 — Frontend

```bash
cd algoVisualiser  # (project root)
npm run dev
```

 **Wait for:**

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**Now open  [http://localhost:5173](http://localhost:5173) in your browser**

### 🧠 Step 6: Test It Out

- **Register** → Create a test account
- **Login** → Access your dashboard
- **Visualize Algorithms** → See step-by-step animations
- **Add Notes** → Save personal insights
- **Track Progress** → Watch streaks grow!

---

##  Common Issues

| Error | Solution |
|-------|----------|
| Cannot connect to DB | Ensure PostgreSQL is running and `.env` is correct. Run `npm run setup-db` in backend folder |
| Password authentication failed | Check your PostgreSQL password in `.env`. See `backend/FIX_PASSWORD.md` |
| JWT Secret not defined | Add `JWT_SECRET` to `.env` and restart backend |
| Blank frontend page | Refresh or check console errors |
| Module not found | Run `npm install` again |
| Email not sending | For Gmail, use App Password (not regular password). See `backend/GMAIL_APP_PASSWORD.md` |

## 📚 Additional Documentation

- **Quick Start**: `backend/QUICK_START.md` - Fast setup guide
- **Database Troubleshooting**: `backend/TROUBLESHOOTING_DB.md` - Fix database connection issues
- **Email Setup**: `backend/EMAIL_SETUP_GUIDE.md` - Configure email notifications
- **Gmail App Password**: `backend/GMAIL_APP_PASSWORD.md` - Quick Gmail setup

---


---

## 📊 Project Metadata

```yaml
app:
  name: Algorithm Visualizer
  version: 1.0.0-MVP
  status: Development (Local Build)
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
    - Pathfinding - planned
  visualization:
    engine: D3.js
    controls: Play, Pause, Step, Speed (
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

##  Team

| Member | ID | Role |
|--------|-----|------|
| **Anushka Das** | AM.SC.U4CSE23108 | Project Lead / Full-Stack |
| **Revathi V** | AM.SC.U4CSE23145 | Backend Developer |
| **Pavithra Nair** | AM.SC.U4CSE23141 | Gamification & Testing Lead |
| **Meghna Binod** | AM.SC.U4CSE23135 | Frontend & Database Administrator |


---

##  Upcoming Plans

- [ ] Other DSA Algorithms (A*, Maze generation)
- [ ] Online deployment (Netlify + Render)
- [ ] Additional sorting algorithms
- [ ] User preferences and settings
- [ ] Export/import notes
- [ ] Light mode
- [ ] Mobile app
- [x] Email/Notifications to users regarding streak ✅
- [x] Educator features (add/edit algorithms, manage requests) ✅
- [x] Student-educator messaging system ✅
- [x] File uploads for learning resources ✅
- [x] Dynamic D3.js visualization support ✅


Thank you

---

