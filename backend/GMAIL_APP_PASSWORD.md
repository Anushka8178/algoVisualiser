# 🔐 Quick Fix: Gmail App Password Setup

## The Problem
You're seeing this error:
```
Failed to send streak email: Invalid login: 535-5.7.8 Username and Password not accepted
```

This happens because **Gmail doesn't allow using your regular password** for SMTP. You need to create an **App Password**.

## ✅ Quick Fix (5 Minutes)

### Step 1: Enable 2-Factor Authentication (if not already enabled)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click **2-Step Verification**
3. Follow the prompts to enable it (you'll need your phone)

### Step 2: Generate App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", find **App passwords**
   - If you don't see it, make sure 2-Step Verification is enabled first
3. Click **App passwords**
4. Select:
   - **App**: Mail
   - **Device**: Other (Custom name)
   - **Name**: Enter "AlgoVisualizer"
5. Click **Generate**
6. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)
   - ⚠️ **Important**: Copy it now - you won't be able to see it again!

### Step 3: Update Your .env File

Open `backend/.env` and update the `SMTP_PASS` line:

**Before (wrong):**
```env
SMTP_PASS=Anushka@06
```

**After (correct):**
```env
SMTP_PASS=abcdefghijklmnop
```
*(Use the 16-character App Password you just generated - remove spaces if any)*

### Step 4: Restart Backend Server

Stop your backend server (Ctrl+C) and restart it:
```bash
cd backend
npm run dev
```

### Step 5: Test It

1. Log in as a student
2. Complete an algorithm
3. Check your email inbox for the streak notification!

## ✅ Success Indicators

When it's working, you'll see in the backend console:
```
[mail] ✅ Email sent to student@email.com
```

Instead of:
```
[mail] ❌ Failed to send email...
```

## 🔍 Troubleshooting

### "App passwords" option not showing?
- Make sure 2-Step Verification is **fully enabled** (not just set up)
- Wait a few minutes and refresh the page
- Try a different browser

### Still getting authentication errors?
- Double-check you copied the **entire** 16-character password
- Make sure there are **no spaces** in the password in `.env`
- Verify `SMTP_USER` matches your Gmail address exactly
- Make sure you restarted the backend server after updating `.env`

### Want to disable email temporarily?
Just remove or comment out the SMTP variables in `.env`:
```env
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
```

The app will continue working, just without email notifications.

## 📧 Alternative: Use a Different Email Provider

If Gmail is too complicated, you can use:
- **Outlook**: Similar process, see `EMAIL_SETUP_GUIDE.md`
- **SendGrid**: Free tier available, better for production
- **Mailgun**: Another good option for production

See `EMAIL_SETUP_GUIDE.md` for details on other providers.

