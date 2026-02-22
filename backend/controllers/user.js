const db = require("../db.js");
const bcrypt = require("bcryptjs");

const userInfo = async (req, res) => {
    const id = req.user.id
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
        if (user.length == 0) return res.status(400).json({ message: "User Not Signed in" })

        return res.status(200).json({ user })
    } catch (error) {
        console.error("userInfo error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
}

const editInfo = async (req, res) => {
    const id = req.user.id

    try {
        let updates = {}

        const { phone_number, username, year, bio } = req.body

        if (phone_number) updates.phone_number = phone_number
        if (username) updates.username = username
        if (year) updates.year = year
        if (bio) updates.bio = bio


        if (Object.keys(updates).length == 0) {
            return res.status(400).json({ message: "NO info detected in updating" })
        }
        const allowedFields = ["phone_number", "username", "year", "bio"];
        const keys = Object.keys(updates).filter((key) => allowedFields.includes(key));
        if (keys.length === 0) {
            return res.status(400).json({ message: "NO valid fields detected in updating" });
        }
        const query = "UPDATE users SET " + keys.map((key, i) => `${key} = $${i + 1}`).join(', ') + ` WHERE id = $${keys.length + 1}`;

        const values = [...keys.map((key) => updates[key]), id];
        await db.query(query, values)

        const { rows: updatedUser } = await db.query(
            "SELECT * FROM users WHERE id = $1", [id]
        );

        return res.json(updatedUser[0])
    } catch (error) {
        console.error("editInfo error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
}

const deleteAccount = async (req, res) => {
    const id = req.user.id

    try {
        await db.query("DELETE FROM refreshtokens WHERE user_id = $1", [id])
        await db.query("DELETE FROM studentcourses WHERE student_id = $1", [id])
        await db.query("DELETE FROM studenttasks WHERE student_id = $1", [id])
        const result = await db.query("DELETE FROM users WHERE id = $1", [id])

        if (result.rowCount === 0) return res.status(401).json({ message: "User Not found" })

        return res.json({ message: "Account deleted successfully" })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const changepass = async (req, res) => {
    const id = req.user.id
    const { currentpass, newpass, confirmpass } = req.body
    if (!currentpass) {
        return res.status(400).json({ message: "Need current password" });
    }
    if (!newpass || !confirmpass) {
        return res.status(400).json({ message: "Provide new password and its confirmation" });
    }
    if (newpass !== confirmpass) {
        return res.status(400).json({ message: "new Password dont match the confirmation" });
    }
    try {
        const { rows: user } = await db.query("SELECT hashedpass FROM users WHERE id = $1", [id])
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const verify = await bcrypt.compare(currentpass, user[0].hashedpass)

        if (!verify) return res.status(400).json({ message: "current password is not correct" })

        const hashedpass = await bcrypt.hash(newpass, 10)
        await db.query("UPDATE users SET hashedpass = $1 WHERE id = $2", [hashedpass, id])
        return res.status(200).json({ message: "password changed successfully" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

module.exports = {
    userInfo,
    editInfo,
    deleteAccount,
    changepass
}