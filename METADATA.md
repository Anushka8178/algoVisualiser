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
