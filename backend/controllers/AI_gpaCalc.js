const { sendMessage } = require("../services/AI.service")
const db = require("../config/db")

const editUserGpa = async (req,res) => {
    const user_id = req.user.id;
    try {
        const { gpa } = req.body

        if(gpa < 0.00 || gpa > 4.00) return res.status(400).json({ message: "Invalid GPA Must be between 0.00 - 4.00"})
        await db.query(`UPDATE users SET gpa = $1 WHERE id = $2`, [ gpa, user_id ])

        res.status(200).json({ message: "GPA Saved Successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error updating GPA", error: error.message })
    }
}


const chatBot = async (req,res) => {
    try {
        const { msg, history = []} = req.body

        if(!msg) return res.status(400).json({ error: "Message is required" });

        const aiReply = await sendMessage(msg, history)
        let parsedReply;

        try {
            parsedReply = JSON.parse(aiReply)
        } catch (error) {
            parsedReply = { message: aiReply }
        }

        const newHistory = [
            ...history,
            { role: "user", text: msg},
            { role: "model", text: parsedReply.message}
        ]


        return res.json({
            message: aiReply,
            newHistory: newHistory
        })

    } catch (error) {
        console.error("AI ERROR:", error);
            return res.status(500).json({
                error: "AI Chat failed",
                details: error.message
        });
    }
}
module.exports = { editUserGpa, chatBot }