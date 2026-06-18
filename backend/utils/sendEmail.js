const nodemailer = require('nodemailer');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const sendEmail = async (to, subject, text) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('EMAIL_USER and EMAIL_PASS must be set');
        }

        const mailOptions = {
            from: `"ShopNest" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: text
        };

        const smtpAddresses = await dns.promises.resolve4('smtp.gmail.com');
        const smtpHost = smtpAddresses[0] || 'smtp.gmail.com';
        const baseTransportOptions = {
            host: smtpHost,
            connectionTimeout: 30000,
            greetingTimeout: 30000,
            socketTimeout: 30000,
            tls: {
                servername: 'smtp.gmail.com'
            },
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        };

        const attempts = [
            { ...baseTransportOptions, port: 587, secure: false, requireTLS: true },
            { ...baseTransportOptions, port: 465, secure: true },
        ];

        const errors = [];

        for (const options of attempts) {
            try {
                const transporter = nodemailer.createTransport(options);
                await transporter.sendMail(mailOptions);
                return;
            } catch (error) {
                errors.push(`${options.port}: ${error.message}`);
            }
        }

        throw new Error(errors.join(' | '));
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = sendEmail;
