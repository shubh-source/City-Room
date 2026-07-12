const nodemailer = require('nodemailer');

const sendEmailOTP = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"City Room" <${process.env.SMTP_EMAIL}>`,
      to: to,
      subject: 'Your Login Verification Code - City Room',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #6366f1; text-align: center;">City Room</h2>
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #333;">Your verification code to login/signup for City Room is:</p>
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #0f172a; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="font-size: 14px; color: #64748b;">This code is valid for 10 minutes. Please do not share it with anyone.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendEmailOTP };
