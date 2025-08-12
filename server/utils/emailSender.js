import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME = 'subhanjavaid68@gmail.com',
        pass: process.env.EMAIL_PASSWORD = 'ohjiuplepevrdekf',
      },
    });

    const mailOptions = {
      from: 'User Management System <noreply@yourapp.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');

  } catch (error) {
    console.error('Error sending email:', error);
  }
};