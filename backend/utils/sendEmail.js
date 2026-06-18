const nodemailer = require('nodemailer');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const sendWithResend = async (mailOptions) => {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: mailOptions.from,
            to: [mailOptions.to],
            subject: mailOptions.subject,
            html: mailOptions.html,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error?.message || 'Resend API request failed');
    }
};

const sendWithGmailSmtp = async (mailOptions) => {
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
};

const sendEmail = async (to, subject, text) => {
    try {
        const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

        if (!fromEmail) {
            throw new Error('EMAIL_FROM or EMAIL_USER must be set');
        }

        const mailOptions = {
            from: `"ShopNest" <${fromEmail}>`,
            to,
            subject,
            html: text
        };

        if (process.env.RESEND_API_KEY) {
            try {
                await sendWithResend(mailOptions);
                return;
            } catch (error) {
                if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                    throw error;
                }

                console.error('Resend email failed, trying Gmail SMTP:', error.message);
            }
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('RESEND_API_KEY is missing, or EMAIL_USER and EMAIL_PASS must be set for SMTP fallback');
        }

        await sendWithGmailSmtp(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = sendEmail;
