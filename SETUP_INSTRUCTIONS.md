# Step-by-Step Setup Instructions

This guide provides detailed, beginner-friendly instructions for setting up and running the Algorithm Visualizer application.

## 🎯 Quick Start Checklist

- [ ] Node.js installed
- [ ] PostgreSQL installed or cloud database ready
- [ ] Repository cloned
- [ ] Frontend dependencies installed
- [ ] Backend dependencies installed
- [ ] Database created
- [ ] `.env` file configured
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Application accessible in browser

---

## 📥 Step 1: Install Prerequisites

### 1.1 Install Node.js

1. Go to https://nodejs.org/
2. Download the **LTS (Long Term Support)** version
3. Run the installer
4. Follow the installation wizard (use default settings)
5. **Verify installation:**
   - Open Command Prompt (Windows) or Terminal (Mac/Linux)
   - Type: `node --version`
   - You should see a version number (e.g., `v18.17.0`)
   - Type: `npm --version`
   - You should see a version number (e.g., `9.6.7`)

### 1.2 Install PostgreSQL

**Option A: Local PostgreSQL (Recommended for Development)**

1. Go to https://www.postgresql.org/download/
2. Download PostgreSQL for your operating system
3. Run the installer
4. **During installation:**
   - Remember the password you set for the `postgres` user
   - Note the port (default is `5432`)
   - Complete the installation

**Option B: Cloud Database (Recommended for Production)**

You can use free services like:
- **Render**: https://render.com
- **Supabase**: https://supabase.com
- **Heroku Postgres**: https://www.heroku.com/postgres

Follow their setup instructions to create a database and get connection details.

---

## 📂 Step 2: Get the Project Files

### 2.1 Clone from Git

1. Open Command Prompt or Terminal
2. Navigate to where you want the project:
   ```bash
   cd Desktop
   # or
   cd Documents
   ```
3. Clone the repository:
   ```bash
   git clone https://github.com/Anushka8178/algoVisualiser.git
   ```
4. Navigate into the project:
   ```bash
   cd algoVisualiser
   ```

### 2.2 Verify Project Structure

You should see these folders:
- `backend/` - Backend server code
- `src/` - Frontend React code
- `package.json` - Frontend dependencies

---

## 📦 Step 3: Install Dependencies

### 3.1 Install Frontend Dependencies

1. **Make sure you're in the project root** (`algoVisualiser` folder)
2. Run:
   ```bash
   npm install
   ```
3. **Wait for installation to complete** (this may take 2-5 minutes)
4. You should see: `added XXX packages`

### 3.2 Install Backend Dependencies

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```
2. Run:
   ```bash
   npm install
   ```
3. **Wait for installation to complete**
4. You should see: `added XXX packages`

---

## 🗄️ Step 4: Set Up Database

### 4.1 Create Database (Local PostgreSQL)

1. **Open PostgreSQL Command Line** (pgAdmin or psql)
   - On Windows: Search for "SQL Shell (psql)" or "pgAdmin"
   - On Mac/Linux: Open Terminal and type `psql`

2. **Connect to PostgreSQL:**
   - Enter your password when prompted

3. **Create the database:**
   ```sql
   CREATE DATABASE algovisualizer;
   ```

4. **Verify it was created:**
   ```sql
   \l
   ```
   You should see `algovisualizer` in the list

5. **Exit psql:**
   ```sql
   \q
   ```

### 4.2 Note Database Credentials

Write down:
- **Database Name**: `algovisualizer`
- **Username**: Usually `postgres` (or your PostgreSQL username)
- **Password**: The password you set during PostgreSQL installation
- **Host**: `localhost` (for local) or your cloud database URL
- **Port**: `5432` (default) or your cloud database port

---

## ⚙️ Step 5: Configure Backend

### 5.1 Create `.env` File

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Create a new file named `.env`**
   - On Windows: You can use Notepad
   - On Mac/Linux: Use any text editor
   - **Important**: The file must be named exactly `.env` (with the dot at the beginning)

3. **Add the following content to `.env`:**

   ```env
   # Database Configuration
   DB_NAME=algovisualizer
   DB_USER=postgres
   DB_PASS=your_postgres_password_here
   DB_HOST=localhost
   
   # Server Configuration
   PORT=5000
   
   # JWT Secret (generate a random string)
   JWT_SECRET=my_super_secret_jwt_key_change_this_to_something_random_and_long
   ```

### 5.2 Replace the Values

1. **Replace `your_postgres_password_here`** with your actual PostgreSQL password
2. **Replace `my_super_secret_jwt_key_change_this_to_something_random_and_long`** with a random secret string
   - You can use any long random string (e.g., `abc123xyz789secretkey2024`)
   - Or generate one using Node.js:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

### 5.3 Save the File

- Save the `.env` file in the `backend/` folder
- **Important**: Make sure the file is saved as `.env` (not `.env.txt`)

---

## 🚀 Step 6: Run the Application

### 6.1 Start Backend Server (Terminal 1)

1. **Open a terminal/command prompt**

2. **Navigate to the backend folder:**
   ```bash
   cd path/to/algoVisualiser/backend
   ```
   (Replace `path/to` with your actual path)

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Wait for these messages:**
   ```
   Database connected ✅
   Algorithms seeded ✅
   Server running on port 5000
   ```

5. **If you see errors:**
   - Check your `.env` file has correct database credentials
   - Make sure PostgreSQL is running
   - Verify the database exists

6. **Keep this terminal open** - the server must keep running!

### 6.2 Start Frontend Application (Terminal 2)

1. **Open a NEW terminal/command prompt** (don't close Terminal 1!)

2. **Navigate to the project root:**
   ```bash
   cd path/to/algoVisualiser
   ```
   (Replace `path/to` with your actual path)

3. **Start the frontend:**
   ```bash
   npm run dev
   ```

4. **Wait for this message:**
   ```
   VITE v5.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:5173/
   ```

5. **Keep this terminal open too!**

### 6.3 Access the Application

1. **Open your web browser** (Chrome, Firefox, Edge, etc.)

2. **Go to:** `http://localhost:5173`

3. **You should see the Algorithm Visualizer homepage!**

---

## ✅ Step 7: Verify Everything Works

### 7.1 Test Registration

1. Click on **"Register"** or **"Sign Up"**
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Click **"Register"**
4. You should see a success message

### 7.2 Test Login

1. Click on **"Login"**
2. Enter:
   - Email: `test@example.com`
   - Password: `password123`
3. Click **"Login"**
4. You should be logged in and see the Dashboard

### 7.3 Test Visualization

1. Click on any algorithm (e.g., "Bubble Sort")
2. Click **"Visualize"**
3. You should see the algorithm visualization working

---

## 🔧 Common Issues and Solutions

### Issue 1: "Cannot connect to database"

**Solution:**
- ✅ Check PostgreSQL is running
- ✅ Verify database credentials in `backend/.env`
- ✅ Make sure database `algovisualizer` exists
- ✅ Try restarting PostgreSQL service

### Issue 2: "Port 5000 already in use"

**Solution:**
- ✅ Change `PORT=5000` to `PORT=5001` in `backend/.env`
- ✅ Restart the backend server
- ✅ Note: Frontend expects backend on port 5000, so you may need to update frontend code too

### Issue 3: "Cannot connect to server" in browser

**Solution:**
- ✅ Make sure backend is running (check Terminal 1)
- ✅ Check backend console for errors
- ✅ Verify backend shows "Server running on port 5000"

### Issue 4: "Module not found" errors

**Solution:**
- ✅ Run `npm install` again in the folder showing the error
- ✅ Delete `node_modules` folder and `package-lock.json`, then run `npm install`

### Issue 5: Backend shows "JWT_SECRET is not defined"

**Solution:**
- ✅ Make sure `JWT_SECRET` is in `backend/.env`
- ✅ Restart the backend server after adding it

---

## 📋 Quick Reference Commands

### Backend Commands
```bash
cd backend
npm install          # Install dependencies (first time only)
npm start           # Start server
npm run dev         # Start server with auto-reload
```

### Frontend Commands
```bash
cd algoVisualiser   # (project root)
npm install         # Install dependencies (first time only)
npm run dev         # Start development server
npm run build       # Build for production
```

### Database Commands (PostgreSQL)
```sql
CREATE DATABASE algovisualizer;  # Create database
\l                                # List all databases
\q                                # Exit psql
```

---

## 🎓 For Teachers/Instructors

### Setting Up for Multiple Students

1. **Each student needs:**
   - Their own PostgreSQL database (or use cloud databases)
   - Their own `.env` file with their database credentials
   - Node.js installed on their computer

2. **Recommended Setup:**
   - Use cloud databases (Supabase, Render) - easier for students
   - Provide a template `.env` file
   - Have students clone the repository individually

### Testing the Setup

Before students run it:
1. ✅ Test on a clean machine/account
2. ✅ Follow all steps exactly as written
3. ✅ Document any issues encountered
4. ✅ Update instructions if needed

---

## 📞 Need Help?

If you're stuck:
1. Check the error message carefully
2. Review the relevant step in this guide
3. Check the main README.md for more details
4. Verify all prerequisites are installed
5. Make sure both terminals are running

---

**Good luck! 🚀**

