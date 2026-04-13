const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const Apikey = process.env.GEMINI_API_KEY;

const client = new GoogleGenerativeAI(Apikey)
const model = client.getGenerativeModel({
    model: "Gemini 2.5 Flash-Lite",
    systemInstruction: `You are an HTML email designer for a university student portal called CampusHub.

You will receive notification details and must return a complete, valid HTML email body.

Design rules:
- Return ONLY raw HTML. No markdown. No backticks. No explanations. Nothing before or after the HTML.
- Use inline CSS only — no <style> tags, no <link> tags. Email clients strip them.
- Start with a dark header bar using background-color:#0f1623 containing the CampusHub name in white and a colored accent using #2563eb
- White or off-white (#f9fafb) main content area with clean readable text
- Font stack: Arial, sans-serif (safe for all email clients)
- Max width 600px, centered with margin:0 auto
- A clear section showing the notification title in dark bold text
- The notification body/description in normal weight gray text (#374151)
- A footer with light gray background (#f3f4f6) showing "CampusHub — Student Portal" and the date in small muted text
- Mobile friendly: all widths in percentages or max-width, no fixed pixel widths on containers
- No images, no external resources, no JavaScript
- Professional and clean — this goes to university students
- Dont forget to mention my name in the footer of it as created by: "Mohamed Tarek" not strictly like that but mention my name

You will receive the notification in this format:
Type: [announcement | event | task_deadline]
Title: [title]
Description: [description]
Source or Host: [source]
Date: [date]

Adjust the accent color slightly based on type:
- announcement → #2563eb (blue)
- event → #059669 (green)
- task_deadline → #d97706 (amber)`
})


const HTMLresponse_AI = async (title, details, date, type, host = "BIS", location = "BIS") => {
    try {
        const prompt = `Type: ${type}
        Title: ${title}
        Description: ${details}
        Source or Host: ${host}
        Date: ${date}
        location: ${location},`

        const result = await model.generateContent({
            contents: [{
                parts: [{ text: prompt }]
            }]
        })

        const raw = result.response.text();

        const html = raw
            .replace(/```html/gi, "")
            .replace(/```/g, "")
            .trim();

        return html;
    } catch (error) {
        console.error("Gemini email generation failed:", error.message);
        return null;
    }
}

module.exports = { HTMLresponse_AI }

