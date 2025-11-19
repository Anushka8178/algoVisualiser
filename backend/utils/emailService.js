import nodemailer from "nodemailer";

let transporter = null;

const buildTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    console.warn("[mail] SMTP environment variables missing – email notifications disabled.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: {
      user,
      pass,
    },
  });
};

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) return;

  if (!transporter) {
    transporter = buildTransporter();
  }

  if (!transporter) return;

  const from = process.env.SMTP_FROM || "no-reply@algovisualizer.app";

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    console.log(`[mail] ✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`[mail] ❌ Failed to send email to ${to}:`, error.message);
    
    // Provide helpful error messages
    if (error.message.includes("Invalid login") || error.message.includes("BadCredentials")) {
      console.error("[mail] 💡 Tip: For Gmail, you need to use an App Password, not your regular password.");
      console.error("[mail] 💡 See EMAIL_SETUP_GUIDE.md or GMAIL_APP_PASSWORD.md for instructions.");
    }
    
    // Don't throw - email failures shouldn't break the app
    return false;
  }
  
  return true;
};

export const sendStreakNotification = async ({ userEmail, username, previousStreak, newStreak }) => {
  if (!userEmail) return;

  const subject =
    newStreak > previousStreak
      ? `🔥 Streak extended to ${newStreak} days!`
      : "Your learning streak has restarted";

  const friendlyName = username ? username.split(" ")[0] : "there";

  const body = newStreak > previousStreak
    ? `Great job ${friendlyName}! You kept your learning streak alive and reached ${newStreak} days in a row. Keep the momentum going!`
    : `Hey ${friendlyName}, your learning streak has restarted. Jump back into a visualization today to build it up again.`;

  try {
    await sendEmail({
      to: userEmail,
      subject,
      text: body,
    });
  } catch (error) {
    console.error("[mail] Streak notification failed (non-critical)");
  }
};

export const sendPasswordResetEmail = async ({ userEmail, username, resetToken, resetUrl }) => {
  if (!userEmail || !resetToken) return;

  const friendlyName = username ? username.split(" ")[0] : "there";
  const resetLink = resetUrl || `http://localhost:5173/reset-password?token=${resetToken}`;

  const subject = "Reset Your Password - Algorithm Visualizer";

  const text = `Hello ${friendlyName},

You requested to reset your password for your Algorithm Visualizer account.

Click the link below to reset your password:
${resetLink}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

Best regards,
Algorithm Visualizer Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background-color: #0f172a; padding: 30px; border-radius: 10px; color: white;">
        <h1 style="color: #06b6d4; margin-top: 0;">Algorithm Visualizer</h1>
        <h2 style="color: #fff; margin-top: 20px;">Password Reset Request</h2>
      </div>
      <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
        <p>Hello ${friendlyName},</p>
        <p>You requested to reset your password for your Algorithm Visualizer account.</p>
        <p style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #06b6d4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            Reset Password
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #06b6d4; font-size: 12px; word-break: break-all;">${resetLink}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">This link will expire in 1 hour.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      to: userEmail,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("[mail] Password reset email failed (non-critical)");
  }
};


