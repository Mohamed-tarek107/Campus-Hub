const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const Apikey = process.env.GEMINI_API_KEY;

const client = new GoogleGenerativeAI(Apikey)
const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `GPA Advisor:
You are a GPA advisor for university students at a Business Information Systems (BIS) faculty that uses the Credit Hour System.

The grade scale is:
A+ = 4.00, A = 3.75, B+ = 3.40, B = 3.10, C+ = 2.80, C = 2.50, D+ = 2.25, D = 2.00, F = 0.00

GPA formula: sum of (grade points × credit hours) divided by total credit hours.

Your job is to:
- Help students understand their GPA and how it is calculated
- Answer questions about the grade scale
- Give practical advice on how to improve GPA
- Help students estimate what grades they need to reach a target GPA
- Give study tips and encouragement

Rules:
- Be concise and direct, students don't want long paragraphs
- Never use markdown headers or bullet symbols like * or **
- Use plain conversational text
- If a student gives you numbers, do the math and show the result clearly
- Stay on topic — only answer academic and GPA related questions
- If asked something unrelated, politely redirect back to academics`
})

const formatMsg = (historyArr) => {
    return historyArr.map(i => ({
        role: i.role,
        parts: [{ text: i.text }]
    }))
}



const sendMessage = async (msg, history) => {
    const formattedHistory = formatMsg(history)

    const result = await model.generateContent({
        contents: [
            ...formattedHistory,
            { role: "user", parts: [{ text: msg }] }
        ]
    })
    const response = result.response.text()
    //remove markdown code:
    return response.replace(/```json\n?|\n?```/g, '').trim()
}


module.exports = { sendMessage, formatMsg }