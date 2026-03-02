const nodemailer = require("nodemailer");
require("dotenv").config();

const Apikey = process.env.GEMINI_API_KEY;

const client = new GoogleGenerativeAI(Apikey)
const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: ``
})




