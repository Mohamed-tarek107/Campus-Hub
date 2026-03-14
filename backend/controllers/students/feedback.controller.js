const db = require("../../config/db");

// Save student feedback.
const takeFeedback = async (req, res) => {
    const user_id = req.user.id;
    try {
        const { feedback } = req.body;

        if (!feedback) return res.status(404).json({ message: "Please Provide feedback" });

        await db.query("INSERT INTO feedbacks (user_id, feedback) VALUES ($1,$2)", [user_id, feedback]);

        return res.status(201).json({ message: "Feedback Taken Successfully" });
    } catch (error) {
        console.error("viewAllStudent_tasks error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { takeFeedback };
