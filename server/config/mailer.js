import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const EMAIL_USER = process.env.EMAIL_USER || 'bloodlink112@gmail.com';
export const OFFICIAL_SENDER = `"BloodLink Emergency Dispatch" <${EMAIL_USER}>`;

// Configure Gmail SMTP Transporter
export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Diagnostics & Connection Verifier
 * Verifies SMTP connection without exposing passwords
 */
export async function verifyTransporter() {
  try {
    if (!process.env.EMAIL_APP_PASSWORD) {
      console.warn('⚠️ [BloodLink Mailer] Warning: EMAIL_APP_PASSWORD is not set in .env');
      return { success: false, status: 'NO_PASSWORD_CONFIGURED', error: 'EMAIL_APP_PASSWORD is not set' };
    }

    const verified = await transporter.verify();
    console.log(`✅ [BloodLink Mailer] Gmail SMTP connected successfully for official sender: ${EMAIL_USER}`);
    return { success: true, status: 'CONNECTED', user: EMAIL_USER };
  } catch (error) {
    console.error(`❌ [BloodLink Mailer] SMTP Authentication Notice: ${error.message}`);
    return { 
      success: false, 
      status: 'AUTH_REQUIRED', 
      user: EMAIL_USER,
      error: error.message,
      help: 'Google requires a 16-letter App Password from https://myaccount.google.com/apppasswords'
    };
  }
}
