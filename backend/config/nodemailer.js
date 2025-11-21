const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // Your Gmail app-specific password
  }
});

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `http://localhost:5000/api/v1/auth/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email for Mobile Recharge App',
    html: `<p>Please verify your email by clicking the link below:</p>
           <a href="${verificationLink}">${verificationLink}</a>
           <p>This link will expire in 24 hours.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

const sendRechargeConfirmationEmail = async (email, rechargeDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recharge Confirmation - Mobile Recharge App',
    html: `<p>Dear ${rechargeDetails.currentUser},</p>
           <p>Your recharge of ₹${rechargeDetails.amount} for mobile number ${rechargeDetails.mobileNumber} has been successfully processed.</p>
           <h3>Recharge Details:</h3>
           <ul>
             <li><strong>Operator:</strong> ${rechargeDetails.operator}</li>
             <li><strong>Validity:</strong> ${rechargeDetails.validity}</li>
             <li><strong>Data:</strong> ${rechargeDetails.data}</li>
             <li><strong>Calls:</strong> ${rechargeDetails.calls}</li>
             <li><strong>SMS:</strong> ${rechargeDetails.sms}</li>
             <li><strong>Transaction ID:</strong> ${rechargeDetails.transactionId || 'N/A'}</li>
           </ul>
           <p>Thank you for using our service!</p>
           <p>Best regards,<br>Mobile Recharge App Team</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Recharge confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending recharge confirmation email:', error);
    throw new Error('Failed to send recharge confirmation email');
  }
};

module.exports = { sendVerificationEmail, sendRechargeConfirmationEmail };