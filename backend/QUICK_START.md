# 🚀 Quick Start Guide

## Fix Database Connection Issues

### Step 1: Update Your `.env` File

Make sure your `backend/.env` file has the correct values. Based on your setup, it should be:

```env
DB_NAME=algodb
DB_USER=postgres
DB_PASS=postgres
DB_HOST=127.0.0.1
DB_PORT=5433
PORT=5000
JWT_SECRET=dev_secret_key_change_in_production
```

**Important:** 
- Replace `postgres` in `DB_PASS` with your actual PostgreSQL password if it's different
- If your database name is `algovisualizer` instead of `algodb`, change `DB_NAME` accordingly

### Step 2: Verify Database Exists

Open PostgreSQL terminal:
```bash
psql -U postgres -p 5433
```

Then check if your database exists:
```sql
\l
```

If `algodb` doesn't exist, create it:
```sql
CREATE DATABASE algodb;
\q
```

### Step 3: Run Database Setup

```bash
cd backend
npm run setup-db
```

This will:
- Check if `.env` file exists (create if missing)
- Verify PostgreSQL connection
- Create database if it doesn't exist
- Test the connection

### Step 4: Start the Backend Server

```bash
cd backend
npm run dev
```

The server should start on `http://localhost:5000`

### Step 5: Start the Frontend

In a new terminal:
```bash
npm run dev
```

The frontend should start on `http://localhost:5173`

## Common Issues

### ❌ "password authentication failed"
- **Solution:** Check your PostgreSQL password in `.env` file
- Try connecting manually: `psql -U postgres -p 5433`
- If it asks for a password, use that password in `.env`

### ❌ "database does not exist"
- **Solution:** Run `npm run setup-db` to create it automatically
- Or create manually: `CREATE DATABASE algodb;`

### ❌ "Cannot connect to server"
- **Solution:** Make sure PostgreSQL service is running
- Windows: Check Services (Win+R → `services.msc`) for PostgreSQL
- Or run: `Get-Service -Name postgresql*`

### ❌ "Port 5000 already in use"
- **Solution:** Change `PORT` in `.env` to a different port (e.g., `5001`)
- Or stop the process using port 5000

## All Features Available

✅ Student Features:
- Request algorithms
- View algorithm visualizations
- View learning materials and resources
- Track progress and streaks
- View leaderboard
- Receive messages from educators

✅ Educator Features:
- View student algorithm requests
- Add new algorithms with D3.js visualizations
- Edit/delete algorithms
- Upload learning resources (PDFs, links)
- Send messages to students
- Mark requests as completed

✅ System Features:
- Email notifications for streak updates
- File uploads for resources
- Dynamic D3.js visualization rendering
- Role-based access control

