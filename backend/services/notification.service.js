const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const db = require("../config/db")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MYMAIL,
        pass: process.env.APP_PASS,
    },
});

const notificationMail = async (subject, html) => {
    try {
        if (!html) { 
        console.error("notificationMail: no html body, skipping.");
        return false;
    }
        const batchSize = 30;
        const { rows: users } = await db.query("SELECT email FROM users");

        for (let i = 0; i < users.length; i += batchSize) {
            const batch = users.slice(i, i + batchSize).filter((user) => user?.email);

            await Promise.all(
                batch.map((user) =>
                    transporter.sendMail({
                        from: {
                            name: "CampusHub App",
                            address: process.env.MYMAIL,
                        },
                        to: user.email,
                        subject: `${subject}`,
                        html: `${html}`,
                    })
                )
            );
        }
        return true;
    } catch (error) {
        console.error("Mail error:", error);
        return false;
    }
};

module.exports = {
    notificationMail
};