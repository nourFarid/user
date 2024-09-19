const nodemailer = require('nodemailer');
require('dotenv').config();  // Load environment variables

// Create a transporter object using your email service
const transporter = nodemailer.createTransport({
    service: 'gmail', // Change to your email provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send an email
const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return { success: true, response: info.response };
    } catch (error) {
        console.error('Error occurred:', error);
        return { success: false, error };
    }
};

module.exports = { sendEmail };
