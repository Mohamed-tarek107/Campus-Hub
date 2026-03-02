const nodemailer = require("nodemailer");
require("dotenv").config();


const client = new GoogleGenerativeAI(Apikey)
const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: ``
})




