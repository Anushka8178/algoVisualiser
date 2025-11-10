# 🚀 How to Run the Modules

This document provides clear, step-by-step instructions for running the Algorithm Visualizer application.

## ⚠️ Important: Two Terminals Required

The application consists of **two separate modules** that must run simultaneously:
1. **Backend Server** (Node.js/Express)
2. **Frontend Application** (React/Vite)

You need **TWO separate terminal windows** - one for each module.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js** installed (version 20 or higher)
  - Check: `node --version`
  - Download: https://nodejs.org/

- [ ] **PostgreSQL** installed and running
  - Check: `psql --version`
  - Download: https://www.postgresql.org/download/

- [ ] **Database created**
  - Run: `CREATE DATABASE algovisualizer;` in PostgreSQL

- [ ] **Dependencies installed**
  - Frontend: Run `npm install` in project root
  - Backend: Run `npm install` in `backend/` folder

- [ ] **Environment file configured**
  - Create `backend/.env` file (see `backend/ENV_EXAMPLE.txt`)

---

## 🎯 Quick Start (5 Steps)

### Step 1: Open Terminal 1 - Backend

1. Open your terminal/command prompt
2. Navigate to the backend folder:

```bash
cd path/to/algoVisualiser/backend
```

3. Start the backend server:

```bash
npm run dev
```

**Expected Output:**
```
Database connected ✅
Algorithms seeded ✅
Server running on port 5000
```

✅ **Keep this terminal open!** The backend must keep running.

---

### Step 2: Open Terminal 2 - Frontend

1. Open a **NEW terminal/command prompt** (don't close Terminal 1!)
2. Navigate to the project root:

```bash
cd path/to/algoVisualiser
```

3. Start the frontend development server:

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

✅ **Keep this terminal open too!**

---

### Step 3: Open Browser

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Navigate to: **http://localhost:5173**
3. You should see the Algorithm Visualizer homepage!

---

### Step 4: Test the Application

1. **Register** a new account
2. **Login** with your credentials
3. **Browse algorithms** from the dashboard
4. **Visualize** an algorithm (e.g., Bubble Sort)
5. **Add notes** for any algorithm

---

### Step 5: Stop the Servers

When you're done:

1. **Terminal 1 (Backend):** Press `Ctrl + C` to stop
2. **Terminal 2 (Frontend):** Press `Ctrl + C` to stop

---

## 📝 Detailed Instructions

### Module 1: Backend Server

**Location:** `backend/` folder

**Purpose:** 
- Handles API requests
- Manages database operations
- Provides authentication
- Tracks user progress

**Commands:**

```bash
# Navigate to backend
cd backend

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**What to Look For:**
- ✅ "Database connected ✅"
- ✅ "Server running on port 5000"
- ❌ If you see errors, check:
  - Database is running
  - `.env` file is configured correctly
  - Port 5000 is not already in use

**Default Port:** 5000  
**API Base URL:** http://localhost:5000/api

---

### Module 2: Frontend Application

**Location:** Project root (`algoVisualiser/`)

**Purpose:**
- User interface
- Algorithm visualizations
- User interactions

**Commands:**

```bash
# Navigate to project root
cd algoVisualiser

# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**What to Look For:**
- ✅ "VITE v5.x.x ready in xxx ms"
- ✅ "Local: http://localhost:5173/"
- ❌ If you see errors, check:
  - Backend is running
  - Dependencies are installed (`npm install`)

**Default Port:** 5173  
**URL:** http://localhost:5173

---

## 🔧 Configuration

### Backend Configuration

The backend requires a `.env` file in the `backend/` folder:

```env
DB_NAME=algovisualizer
DB_USER=postgres
DB_PASS=your_password
DB_HOST=localhost
PORT=5000
JWT_SECRET=your_secret_key
```

**How to create:**
1. Copy `backend/ENV_EXAMPLE.txt`
2. Rename to `.env`
3. Fill in your database credentials

### Frontend Configuration

The frontend is pre-configured to connect to `http://localhost:5000`.

If your backend runs on a different port, update:
- `src/context/AuthContext.jsx` (line 29)
- Any other API call locations

---

## 🐛 Troubleshooting

### Problem: Backend won't start

**Error:** "Cannot connect to database"

**Solutions:**
1. Check PostgreSQL is running
2. Verify `.env` file has correct credentials
3. Ensure database `algovisualizer` exists
4. Check database host and port

**Error:** "Port 5000 already in use"

**Solutions:**
1. Change `PORT=5001` in `backend/.env`
2. Restart backend server
3. Update frontend API URLs if needed

**Error:** "JWT_SECRET is not defined"

**Solutions:**
1. Add `JWT_SECRET=...` to `backend/.env`
2. Restart backend server

---

### Problem: Frontend won't start

**Error:** "Cannot connect to server"

**Solutions:**
1. Make sure backend is running (check Terminal 1)
2. Verify backend is on port 5000
3. Check browser console for specific errors

**Error:** "Module not found"

**Solutions:**
1. Run `npm install` in project root
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again

**Error:** Blank page

**Solutions:**
1. Check browser console (F12)
2. Ensure both servers are running
3. Clear browser cache
4. Try hard refresh (Ctrl + Shift + R)

---

## 📊 Module Communication

```
┌─────────────┐         HTTP Requests          ┌─────────────┐
│   Frontend  │ ────────────────────────────────> │   Backend    │
│  (Port 5173)│ <──────────────────────────────── │  (Port 5000) │
└─────────────┘         JSON Responses          └─────────────┘
                                                         │
                                                         │ SQL Queries
                                                         ▼
                                                  ┌─────────────┐
                                                  │  PostgreSQL  │
                                                  │  (Port 5432) │
                                                  └─────────────┘
```

**Flow:**
1. User interacts with Frontend (browser)
2. Frontend sends API requests to Backend
3. Backend processes requests and queries Database
4. Backend sends responses back to Frontend
5. Frontend updates the UI

---

## ✅ Verification Checklist

After starting both modules, verify:

- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Frontend terminal shows "Local: http://localhost:5173/"
- [ ] Browser can access http://localhost:5173
- [ ] Homepage loads without errors
- [ ] Can register a new account
- [ ] Can login with credentials
- [ ] Can view algorithms
- [ ] Can visualize an algorithm

---

## 🎓 For Teachers/Instructors

### Running for the First Time

1. Follow the **Prerequisites Checklist** above
2. Complete **Step 1-5** in order
3. Test all features to ensure everything works

### Running After Setup

1. Start Terminal 1: `cd backend && npm run dev`
2. Start Terminal 2: `cd algoVisualiser && npm run dev`
3. Open browser: http://localhost:5173

### Common Student Issues

- **"Cannot connect to server"** → Backend not running
- **"Database error"** → PostgreSQL not running or wrong credentials
- **"Module not found"** → Dependencies not installed

---

## 📚 Additional Resources

- **[README.md](README.md)** - Complete project documentation
- **[SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)** - Detailed setup guide
- **[QUICK_START.md](QUICK_START.md)** - Quick reference
- **[PROJECT_METADATA.md](PROJECT_METADATA.md)** - Technical details

---

## 💡 Tips

1. **Keep both terminals visible** - easier to see errors
2. **Check terminal output** - errors appear there first
3. **Use `npm run dev`** - auto-reloads on file changes
4. **Clear browser cache** - if UI seems outdated
5. **Check browser console** - for frontend errors (F12)

---

**Need help?** Check the troubleshooting section or review the detailed documentation files.

**Happy coding! 🚀**

