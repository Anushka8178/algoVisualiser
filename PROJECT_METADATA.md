# Algorithm Visualizer - Project Metadata

## 📊 Project Information

**Project Name:** Algorithm Visualizer  
**Repository:** https://github.com/Anushka8178/algoVisualiser.git  
**Type:** Full-Stack Web Application  
**Purpose:** Educational tool for visualizing algorithms with gamification features

---

## 🏗️ Architecture Overview

### Frontend (React + Vite)
- **Location:** Root directory (`src/` folder)
- **Port:** 5173 (default)
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Visualization:** D3.js
- **Animations:** Framer Motion

### Backend (Node.js + Express)
- **Location:** `backend/` folder
- **Port:** 5000 (default, configurable)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens)

---

## 📁 Module Structure

### Frontend Modules

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   ├── Login.jsx       # Login form
│   ├── ProtectedRoute.jsx  # Route protection
│   └── ...
│
├── pages/               # Page components
│   ├── Dashboard.jsx   # Algorithm list
│   ├── Visualize.jsx   # Visualization page
│   ├── Material.jsx    # Algorithm theory
│   ├── Notes.jsx       # User notes
│   ├── Profile.jsx      # User profile
│   ├── Leaderboard.jsx # Rankings
│   └── Register.jsx    # Registration
│
├── visualizations/     # Algorithm visualizations
│   ├── BubbleSortViz.jsx
│   ├── QuickSortViz.jsx
│   ├── DijkstraViz.jsx
│   └── ... (10 total)
│
├── algos/             # Algorithm step logic
│   ├── bubbleSortSteps.js
│   ├── quickSortSteps.js
│   └── ... (10 total)
│
├── context/           # React Context
│   └── AuthContext.jsx  # Authentication state
│
└── hooks/            # Custom hooks
    ├── usePlayer.js   # Playback control
    └── useArrayRenderer.js
```

### Backend Modules

```
backend/
├── config/
│   └── db.js          # Database configuration
│
├── models/            # Sequelize models
│   ├── User.js        # User model
│   ├── Algorithm.js   # Algorithm model
│   ├── Note.js        # Note model
│   └── UserProgress.js # Progress tracking
│
├── routes/            # API endpoints
│   ├── authRoutes.js  # /api/auth (login, register)
│   ├── algorithmRoutes.js  # /api/algorithms
│   ├── noteRoutes.js  # /api/notes
│   ├── progressRoutes.js  # /api/progress
│   └── leaderboardRoutes.js  # /api/leaderboard
│
├── middleware/
│   └── authMiddleware.js  # JWT verification
│
└── server.js          # Entry point
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Algorithms (`/api/algorithms`)
- `GET /api/algorithms` - Get all algorithms
- `GET /api/algorithms/:id` - Get algorithm by ID

### Notes (`/api/notes`)
- `GET /api/notes/:algorithmId` - Get user's notes for algorithm
- `POST /api/notes` - Create/update note
- `DELETE /api/notes/:id` - Delete note

### Progress (`/api/progress`)
- `POST /api/progress/complete` - Mark algorithm as completed
- `GET /api/progress/history` - Get user's activity history
- `GET /api/progress/stats` - Get user statistics

### Leaderboard (`/api/leaderboard`)
- `GET /api/leaderboard` - Get leaderboard rankings

---

##  Database Schema

### Users Table
- `id` (Primary Key)
- `username` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `streak` (Integer, Default: 0)
- `lastActiveDate` (Date)
- `totalEngagement` (Integer, Default: 0)

### Algorithms Table
- `id` (Primary Key)
- `title` (String)
- `category` (String: "Sorting", "Searching", "Graph")
- `description` (String)
- `complexity` (String)
- `slug` (String, Unique)

### Notes Table
- `id` (Primary Key)
- `userId` (Foreign Key → Users)
- `algorithmId` (Foreign Key → Algorithms)
- `content` (Text)
- `createdAt`, `updatedAt` (Timestamps)

### UserProgress Table
- `id` (Primary Key)
- `userId` (Foreign Key → Users)
- `algorithmId` (Foreign Key → Algorithms)
- `activityType` (String: "completed", "viewed", "notes")
- `completedAt` (Timestamp)

---

## 🔐 Environment Variables

### Backend (.env file)
```env
DB_NAME=algovisualizer
DB_USER=postgres
DB_PASS=your_password
DB_HOST=localhost
PORT=5000
JWT_SECRET=your_secret_key
```

### Frontend
- No environment variables required (hardcoded to `http://localhost:5000`)

---

## 🚀 Running Instructions

### Development Mode

**Backend:**
```bash
cd backend
npm install        # First time only
npm start          # Production mode
# OR
npm run dev       # Development mode (auto-reload)
```

**Frontend:**
```bash
npm install        # First time only
npm run dev        # Development server
```

### Production Build

**Frontend:**
```bash
npm run build      # Creates dist/ folder
npm run preview    # Preview production build
```

---

##  Dependencies

### Frontend Dependencies
- `react` ^18.2.0
- `react-dom` ^18.2.0
- `react-router-dom` ^7.9.5
- `d3` ^7.9.0
- `framer-motion` ^10.16.16
- `vite` ^5.0.8
- `tailwindcss` ^3.4.0

### Backend Dependencies
- `express` ^5.1.0
- `sequelize` ^6.37.7
- `pg` ^8.16.3 (PostgreSQL driver)
- `jsonwebtoken` ^9.0.2
- `bcryptjs` ^3.0.3
- `cors` ^2.8.5
- `dotenv` ^17.2.3

---

## 🎯 Key Features

1. **Algorithm Visualizations** (10 algorithms)
   - Sorting: Bubble, Quick, Merge, Insertion, Heap
   - Searching: Binary, Linear
   - Graph: BFS, DFS, Dijkstra

2. **User Management**
   - Registration and authentication
   - JWT-based sessions
   - Password hashing with bcrypt

3. **Gamification**
   - Daily streak tracking
   - Leaderboard rankings
   - Progress tracking

4. **Personalization**
   - Notes per algorithm
   - Activity history
   - User statistics

5. **UI/UX**
   - Responsive design
   - Smooth animations
   - Modern interface

---

## 🛠️ Development Workflow

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Make Changes:**
   - Backend auto-reloads (with nodemon)
   - Frontend hot-reloads (Vite HMR)

4. **Test:**
   - Open `http://localhost:5173`
   - Test features in browser
   - Check backend console for errors

---

## 📝 Important Notes

- **Database:** Tables are auto-created on first run (`sequelize.sync({ alter: true })`)
- **Algorithms:** Seeded automatically on first run
- **Authentication:** JWT tokens expire after 2 hours
- **CORS:** Enabled for `localhost:5173` (frontend)
- **Ports:** Backend (5000), Frontend (5173)

---

## 🐛 Troubleshooting

See `SETUP_INSTRUCTIONS.md` for detailed troubleshooting guide.

Common issues:
- Database connection errors → Check `.env` file
- Port already in use → Change PORT in `.env`
- Module not found → Run `npm install`
- CORS errors → Check backend is running

---

## 📚 Documentation Files

- `README.md` - Main project documentation
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `QUICK_START.md` - Quick reference
- `PROJECT_METADATA.md` - This file
- `backend/ENV_EXAMPLE.txt` - Environment variable template

---

**Last Updated:** 2024  
**Maintained By:** Development Team

