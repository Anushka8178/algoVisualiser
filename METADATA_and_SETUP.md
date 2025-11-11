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

1. Open PostgreSQL (psql) or pgAdmin
2. Run these commands:

```sql
CREATE DATABASE algovisualizer;
```

3. Note down your:
   - Username (usually `postgres`)
   - Password
   - Host (`localhost`)
   - Port (`5000`) use this port 

###  Step 4: Configure the Backend

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
