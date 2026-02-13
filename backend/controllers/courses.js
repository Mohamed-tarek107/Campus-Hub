const db = require("../db.js");

const AssignDoctors = async (req,res) => {
    try {

    const userId = req.user.id
    //check user avaiable and doctors arent assigned yet( first login)
    const [userRows] = await db.execute("SELECT is_firstlogin FROM users WHERE id = ?", [userId]);
        if (userRows.length === 0) return res.status(404).json({ message: "User not found" });
        if (!userRows[0].is_firstlogin) return res.status(400).json({ message: "Doctors already selected" });

    //need user/doctor/course ids
    //take choices for each course
    const selections = req.body.selections
        if (!Array.isArray(selections) || selections.length === 0) {
        return res.status(400).json({ message: "No doctor selections provided" });
    }
    for(const sel of selections){
        const {course_id, doctor_name} = sel

        //take the doctors id to store in db and handle edge case
        const [docRows] = await db.execute("SELECT id FROM doctors WHERE name = ?", [doctor_name])
        if(docRows.length == 0) return res.status(400).json({ message: `Doctor ${doctor_name} not found` });

        const doctor_id = docRows[0].id;
        const [coursesDocs] = await db.execute("SELECT course_id FROM coursedoctors WHERE doctor_id = ? AND course_id = ?", [doctor_id, course_id])
        if(coursesDocs.length == 0) return res.status(400).json({ message: `Doctor ${doctor_name} Dont have this Course` })
        //assign choices to studentCourses directly(doctors and courses by year is edited by admin)
        await db.execute(
        "INSERT INTO studentCourses (student_id, course_id, doctor_id) VALUES (?, ?, ?)",
        [userId, course_id, doctor_id]
    );
}
    //set firstlogin to false
    await db.execute("UPDATE users SET is_firstlogin = FALSE WHERE id = ?", [userId]);
    res.status(200).json({ 
        message: "Doctors selected successfully",
        selections: selections
    });

    } catch (error) {
        console.error("AddDoctors error:", error);
        res.status(500).json({ message: "Server error" });    
    }
}


module.exports = { 
    AssignDoctors,
}