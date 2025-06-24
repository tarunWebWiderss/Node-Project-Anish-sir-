const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: Number(process.env.MAIL_PORT) === 465, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    },
    greetingTimeout: 10000,
    name: process.env.MAIL_EHLO_DOMAIN || undefined
});

const sendWelcomeEmail = async (to, name) => {
    await transporter.sendMail({
        from: `${process.env.MAIL_FROM_NAME || 'App'} <${process.env.MAIL_FROM_ADDRESS}>`,
        to,
        subject: 'Welcome to Our App!',
        text: `Hello ${name},\n\nWelcome to our app! We're glad to have you.`,
        html: `<h1>Hello ${name},</h1><p>Welcome to our app! We're glad to have you.</p>`
    });
};

module.exports = { sendWelcomeEmail }; 