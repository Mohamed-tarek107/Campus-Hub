const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const Apikey = process.env.GEMINI_API_KEY;

const client = new GoogleGenerativeAI(Apikey)
const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: ``
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
            { role: "user", parts: [{ text: msg }]}
        ]
    })
    const response = result.response.text()
    //remove markdown code:
    return response.replace(/```json\n?|\n?```/g, '').trim()
}


module.exports = { sendMessage, formatMsg }