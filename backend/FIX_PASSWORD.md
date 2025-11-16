# 🔐 Fix Database Password Issue

## The Problem
You're getting: `password authentication failed for user "postgres"`

This means the password in your `.env` file doesn't match your PostgreSQL password.

## Quick Fix Steps

### Step 1: Find Your PostgreSQL Password

Try connecting to PostgreSQL manually:
```bash
psql -U postgres -p 5433
```

If it asks for a password, **that's your actual password**. Use that in the `.env` file.

### Step 2: Update `.env` File

Open `backend/.env` in a text editor and update the `DB_PASS` line:

**Current (wrong):**
```env
DB_PASS=postgres
```

**Update to your actual password:**
```env
DB_PASS=your_actual_password_here
```

**Important:** 
- No quotes around the password
- No spaces before or after the `=` sign
- Use the exact password that works when you run `psql -U postgres -p 5433`

### Step 3: Verify the Fix

After updating `.env`, run:
```bash
cd backend
npm run setup-db
```

You should see:
```
✅ Connected to PostgreSQL server
✅ Database 'algodb' already exists
✅ Successfully connected to 'algodb' database
✅ Database setup complete!
```

### Step 4: Start the Server

```bash
cd backend
npm run dev
```

## Alternative: Use a Different User

If you have another PostgreSQL user with the correct password, you can use that instead:

1. Update `.env`:
```env
DB_USER=your_username
DB_PASS=your_password
```

2. Make sure that user has access to the `algodb` database:
```sql
GRANT ALL PRIVILEGES ON DATABASE algodb TO your_username;
```

## Still Having Issues?

1. **Check if PostgreSQL is running:**
   - Windows: Open Services (Win+R → `services.msc`)
   - Look for PostgreSQL service and make sure it's "Running"

2. **Verify port number:**
   - Your config uses port `5433`
   - Default PostgreSQL port is `5432`
   - If your PostgreSQL uses a different port, update `DB_PORT` in `.env`

3. **Test connection manually:**
   ```bash
   psql -U postgres -h localhost -p 5433 -d postgres
   ```
   If this works, copy the exact credentials to `.env`

