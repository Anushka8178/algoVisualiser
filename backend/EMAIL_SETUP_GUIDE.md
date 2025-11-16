# Email Feature Setup Guide

The email feature automatically sends streak notifications to students when their learning streak changes. This guide will help you configure email sending using various email providers.

## How It Works

- **Automatic Notifications**: When a student completes an algorithm and their streak increases or restarts, they receive an email notification.
- **Email Content**: The email includes a personalized message congratulating them on their streak progress.

## Configuration Steps

### Step 1: Choose an Email Provider

You can use any SMTP-compatible email service. Popular options include:

1. **Gmail** (Recommended for testing)
2. **Outlook/Hotmail**
3. **SendGrid** (For production)
4. **Mailgun** (For production)
5. **Custom SMTP Server**

### Step 2: Get SMTP Credentials

#### Option A: Using Gmail (Easiest for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Navigate to **Security** → **2-Step Verification**
   - Scroll down to **App passwords**
   - Select **Mail** and **Other (Custom name)**
   - Enter "AlgoVisualizer" as the name
   - Copy the 16-character password generated

3. **Gmail SMTP Settings**:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   SMTP_FROM=your-email@gmail.com (optional)
   ```

#### Option B: Using Outlook/Hotmail

1. **Enable 2-Factor Authentication** on your Outlook account
2. **Generate an App Password**:
   - Go to [Microsoft Account Security](https://account.microsoft.com/security)
   - Navigate to **Security** → **Advanced security options**
   - Under **App passwords**, create a new app password
   - Copy the generated password

3. **Outlook SMTP Settings**:
   ```
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=your-email@outlook.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@outlook.com (optional)
   ```

#### Option C: Using SendGrid (Production Recommended)

1. **Sign up** at [SendGrid](https://sendgrid.com/)
2. **Create an API Key**:
   - Go to Settings → API Keys
   - Create a new API key with "Mail Send" permissions
   - Copy the API key

3. **SendGrid SMTP Settings**:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   SMTP_FROM=your-verified-sender@yourdomain.com
   ```

### Step 3: Update Your .env File

1. Open or create `backend/.env` file
2. Add the following SMTP configuration variables:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-or-api-key
SMTP_FROM=your-email@gmail.com
```

**Important Notes:**
- For Gmail, use port `587` (TLS) or `465` (SSL)
- For Outlook, use port `587`
- `SMTP_FROM` is optional - defaults to `no-reply@algovisualizer.app` if not set
- Never commit your `.env` file to version control!

### Step 4: Restart Your Backend Server

After updating the `.env` file, restart your backend server:

```bash
cd backend
npm run dev
```

You should see a message indicating whether email is configured:
- ✅ If configured: No warning message
- ⚠️ If not configured: `[mail] SMTP environment variables missing – email notifications disabled.`

## Testing the Email Feature

### Method 1: Test by Completing an Algorithm

1. Log in as a student
2. Complete an algorithm visualization
3. If your streak increases, you should receive an email at the email address associated with your account

### Method 2: Manual Test (Optional)

You can create a test script to verify email sending. Create `backend/test-email.js`:

```javascript
import dotenv from 'dotenv';
import { sendEmail } from './utils/emailService.js';

dotenv.config();

sendEmail({
  to: 'your-test-email@gmail.com',
  subject: 'Test Email from AlgoVisualizer',
  text: 'This is a test email to verify SMTP configuration.',
  html: '<p>This is a test email to verify SMTP configuration.</p>'
}).then(() => {
  console.log('✅ Email sent successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Email failed:', error.message);
  process.exit(1);
});
```

Run it with:
```bash
node backend/test-email.js
```

## Troubleshooting

### Issue: "SMTP environment variables missing"
**Solution**: Make sure all SMTP variables are set in your `.env` file and the server was restarted.

### Issue: "Invalid login" or "Authentication failed"
**Solution**: 
- For Gmail/Outlook: Make sure you're using an **App Password**, not your regular password
- Double-check that 2FA is enabled and the app password is correct

### Issue: "Connection timeout"
**Solution**: 
- Check your firewall settings
- Verify the SMTP host and port are correct
- Try port `465` with `secure: true` if `587` doesn't work

### Issue: Emails not being received
**Solution**:
- Check spam/junk folder
- Verify the recipient email address is correct
- Check backend console for error messages
- Ensure the email provider isn't blocking the connection

## Security Best Practices

1. **Never commit `.env` to Git** - It's already in `.gitignore`
2. **Use App Passwords** - Don't use your main email password
3. **Use Environment-Specific Accounts** - Consider using a separate email account for development
4. **For Production** - Use a professional email service like SendGrid or Mailgun

## Current Email Features

- ✅ **Streak Notifications**: Automatic emails when student streaks change
- 🔄 **Future**: Can be extended for other notifications (new messages, algorithm requests, etc.)

## Need Help?

If you encounter issues:
1. Check the backend console for error messages
2. Verify your `.env` file has all required variables
3. Test with a simple email provider like Gmail first
4. Check your email provider's documentation for SMTP settings

