# Quick Start Guide

**For those who just want to get it running fast!**

## Prerequisites Check
- [ ] Node.js installed (`node --version` should work)
- [ ] PostgreSQL installed or cloud database ready

## 5-Minute Setup

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. Create Database

In PostgreSQL:
```sql
CREATE DATABASE algovisualizer;
```

### 3. Configure Backend

Create `backend/.env` file:
```env
DB_NAME=algovisualizer
DB_USER=postgres
DB_PASS=your_password
DB_HOST=localhost
PORT=5000
JWT_SECRET=any_random_long_string_here
```

### 4. Run Application

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### 5. Open Browser

Go to: `http://localhost:5173`

---

**Done!** 🎉

For detailed instructions, see `SETUP_INSTRUCTIONS.md`

