import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const emailTemplates = {
  verification: (data) => ({
    subject: 'Verify Your Account',
    html: `
      <h2>Welcome ${data.name}!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${data.verificationUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p>This link will expire in 24 hours.</p>
    `
  }),
  'password-reset': (data) => ({
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset</h2>
      <p>Hi ${data.name},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${data.resetUrl}" style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  })
};

export const sendEmail = async ({ to, subject, template, data }) => {
  try {
    const templateData = emailTemplates[template](data);
    
    const mailOptions = {
      from: `"News Website" <${process.env.SMTP_USER}>`,
      to,
      subject: templateData.subject,
      html: templateData.html
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};