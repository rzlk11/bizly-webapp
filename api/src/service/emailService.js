import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

transporter.verify((err, success) => {
  if (err) console.error('SMTP Connection Error:', err);
  else console.log('SMTP Server Ready:', success);
});

export async function sendMail({ from, to, subject, html, text, attachments }) {
  const mailOptions = { from, to, subject, html, text, attachments };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
