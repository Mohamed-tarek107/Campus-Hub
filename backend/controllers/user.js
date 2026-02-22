const { use } = require("react");
const db = require("../db.js");


const userInfo = async (req,res) => {
    const { id } = req.user.id
    try {
        const { rows: user } = await db.query("SELECT * FROM users WHERE id = $1", [id])
        if(user.length == 0) return res.status(400).json({ message: "User Not Signed in"})

        return res.status(200).json({ user })
    } catch (error) {
        console.error("userInfo error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
}





module.exports = {
    userInfo,
}