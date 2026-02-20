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
  welcome: (data) => ({
    subject: 'Welcome to News Website!',
    html: `
      <h2>Welcome ${data.name}!</h2>
      <p>Thank you for joining our news community. Stay updated with the latest news and stories.</p>
      <p>Your account: ${data.email}</p>
      <p>Start exploring news from trusted reporters and stay informed!</p>
    `
  }),
  'email-verified': (data) => ({
    subject: 'Email Verified Successfully',
    html: `
      <h2>Email Verified!</h2>
      <p>Hi ${data.name},</p>
      <p>Your email has been successfully verified. You can now access all features of our platform.</p>
      <p>Happy reading!</p>
    `
  }),
  'article-published': (data) => ({
    subject: `New Article: ${data.title}`,
    html: `
      <h2>New Article Published</h2>
      <p>A new article has been published by ${data.authorName}:</p>
      <h3>${data.title}</h3>
      <p>${data.excerpt}</p>
      <a href="${data.articleUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Read Article
      </a>
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