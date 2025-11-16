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
    // Error already logged in sendEmail, just prevent crash
    console.error("[mail] Streak notification failed (non-critical)");
  }
};


