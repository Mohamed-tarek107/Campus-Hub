const { use } = require("react");
const db = require("../db.js");


const userInfo = async (req,res) => {
    const { id } = req.user.id
    try {
        const { rows: user } = await db.query(`SELECT
                id,
                username,
                phone_number,
                bio,
                department,
                role,
                year,
                is_firstlogin,
                created_at
                FROM users WHERE id = $1`, [id])
        if(user.length == 0) return res.status(400).json({ message: "User Not Signed in"})

        return res.status(200).json({ user })
    } catch (error) {
        console.error("userInfo error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
}

const editInfo = async (req,res) => {
    const { id } = req.user.id

    try {
        let updates = {}

        const { phone_number, username, year, bio } = req.body

        if(phone_number) updates.phone_number = phone_number
        if(username) updates.username = username
        if(year) updates.year = year
        if(bio) updates.bio = bio


        if(Object.keys(updates).length == 0){
            return res.status(400).json({ message: "NO info detected in updating"})
        }
        const query = ``
        for(let i = 0; i < Object.keys(updates).length; i++){
            query = "UPDATE users SET " + Object.keys(updates).map((key) => `${key} = $${i}`).join(',') + ` WHERE id = ${Object.keys(updates).length + 1}`
        }
        

        const values = [...Object.values(updates), id]
        const [result] = await db.query(query,values)

        if(result.affectedRows === 0){
                return res.status(404).json({ message: "User not found"})
            }

        const [updatedTask] = await db.execute(
            "SELECT * FROM users WHERE id = ?", [ id ]
            );

            return res.json(updatedTask[0])
    } catch (error) {
        console.error("editInfo error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
}



module.exports = {
    userInfo,
    editInfo
}