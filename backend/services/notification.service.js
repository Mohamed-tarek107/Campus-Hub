const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MYMAIL,
        pass: process.env.APP_PASS,
    },
});

const notificationMail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: {
                name: "CampusHub App",
                address: process.env.MYMAIL,
            },
            to,
            subject: `${subject}`,
            html: `${html}`,
        });

        return true;
    } catch (error) {
        console.error("Mail error:", error);
        return false;
    }
};

module.exports = notificationMail;