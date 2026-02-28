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

module.exports = { editUserGpa }