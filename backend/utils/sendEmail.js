const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('EMAIL_USER and EMAIL_PASS must be set');
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            family: 4,
            requireTLS: true,
            connectionTimeout: 30000,
            greetingTimeout: 30000,
            socketTimeout: 30000,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"ShopNest" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: text
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = sendEmail;
