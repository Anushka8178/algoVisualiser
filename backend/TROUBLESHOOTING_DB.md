# Database Connection Troubleshooting

If you're seeing `auth_failed` or database connection errors, follow these steps:

## Quick Fix Checklist

### 1. Check Your `.env` File

Make sure `backend/.env` exists and has the correct values:

```env
DB_NAME=algodb
DB_USER=postgres
DB_PASS=postgres
DB_HOST=127.0.0.1
DB_PORT=5433
```

**Common Issues:**
- ❌ Missing `.env` file → Copy `ENV_EXAMPLE.txt` to `.env`
- ❌ Wrong password → Use your actual PostgreSQL password
- ❌ Extra spaces → Remove spaces around `=` sign
- ❌ Quotes around values → Don't use quotes (unless the value itself contains spaces)

### 2. Verify PostgreSQL is Running

**Windows:**
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# If not running, start it:
Start-Service -Name postgresql-x64-XX  # Replace XX with your version
```

**Or check in Services:**
- Press `Win + R`, type `services.msc`
- Look for "postgresql" service
- Right-click → Start (if stopped)

### 3. Test Database Connection Manually

Open PostgreSQL command line:
```bash
psql -U postgres -p 5433
```

If this fails, your PostgreSQL isn't running or the port is wrong.

### 4. Verify Database Exists

Once connected to PostgreSQL:
```sql
-- List all databases
\l

-- If 'algodb' doesn't exist, create it:
CREATE DATABASE algodb;

-- Exit
\q
```

### 5. Verify User Permissions

```sql
-- Connect to your database
\c algodb

-- Check if user has access
SELECT current_user;
```

### 6. Check Port Number

The default PostgreSQL port is `5432`, but your config uses `5433`.

**To check which port PostgreSQL is using:**
```sql
SHOW port;
```

**Or check in `postgresql.conf`:**
- Location: `C:\Program Files\PostgreSQL\XX\data\postgresql.conf`
- Look for `port = 5432` or `port = 5433`

**Update your `.env` if the port is different:**
```env
DB_PORT=5432  # or whatever port your PostgreSQL uses
```

## Common Error Messages

### `auth_failed`
**Cause:** Wrong username or password
**Fix:** 
- Double-check `DB_USER` and `DB_PASS` in `.env`
- Try connecting manually: `psql -U postgres -p 5433`

### `database "algodb" does not exist`
**Cause:** Database hasn't been created
**Fix:**
```sql
CREATE DATABASE algodb;
```

### `connection refused` or `ECONNREFUSED`
**Cause:** PostgreSQL service not running
**Fix:** Start PostgreSQL service (see step 2)

### `timeout` or `ETIMEDOUT`
**Cause:** Wrong host or port
**Fix:** Check `DB_HOST` and `DB_PORT` in `.env`

## Reset Database (If Needed)

If you want to start fresh:

```sql
-- Connect as postgres user
psql -U postgres -p 5433

-- Drop and recreate database
DROP DATABASE IF EXISTS algodb;
CREATE DATABASE algodb;

-- Exit
\q
```

Then restart your backend server.

## Still Having Issues?

1. **Check backend console** for detailed error messages
2. **Verify `.env` file location** - Must be in `backend/` directory
3. **Restart backend server** after changing `.env`
4. **Check PostgreSQL logs** for more details:
   - Windows: `C:\Program Files\PostgreSQL\XX\data\log\`

## Quick Test Command

Test your connection settings:
```bash
psql -h 127.0.0.1 -p 5433 -U postgres -d algodb
```

If this works, your credentials are correct. If not, fix the issue before running the backend.

