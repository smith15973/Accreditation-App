const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD,    // Your Gmail password (or App password if 2FA is enabled)
    },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(email) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `"${email.from}" <${process.env.EMAIL_USER}>`, // sender address
        to: email.to, // list of receivers
        subject: email.subject, // Subject line
        text: email.text, // plain text body
        html: email.html, // html body
    });

    // console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;