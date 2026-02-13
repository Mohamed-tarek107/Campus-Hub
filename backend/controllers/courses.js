const db = require("../db.js");

//----------Expected REQ BODY-------
// {
//   "selections": [
//     { "course_id": 1, "doctor_name": "Ahmed Ali" },
//     { "course_id": 2, "doctor_name": "Sara Hassan" }
//   ]
// }
// ***** Need transaction(begin -> commit(before return success) -> rollback(if error)  + no returns just throws new error with message to the catch)
const AssignDoctors = async (req,res) => {
    const conn = await db.getConnection()

    try {
        await conn.beginTransaction();
        const userId = req.user.id
        //check user avaiable and doctors arent assigned yet( first login)
        const [userRows] = await conn.execute("SELECT is_firstlogin FROM users WHERE id = ?", [userId]);
            if (userRows.length === 0) throw new Error("USER_NOT_FOUND");
            if (!userRows[0].is_firstlogin) throw new Error("ALREADY_ASSIGNED");

        //need user/doctor/course ids
        //take choices for each course
        const selections = req.body.selections
            if (!Array.isArray(selections) || selections.length === 0) {
                throw new Error("NO_SELECTIONS");
        }
        
        for(const sel of selections){
            const {course_id, doctor_name} = sel

            //take the doctors id to store in db and handle edge case
            const [docRows] = await conn.execute("SELECT id FROM doctors WHERE name = ?", [doctor_name])
            if(docRows.length == 0) throw new Error(`Doctor ${doctor_name} not found`);

            const doctor_id = docRows[0].id;
            const [coursesDocs] = await conn.execute("SELECT course_id FROM coursedoctors WHERE doctor_id = ? AND course_id = ?", [doctor_id, course_id])
            if(coursesDocs.length == 0) throw new Error(`Doctor ${doctor_name} doesn't teach this course`);
            //assign choices to studentCourses directly(doctors and courses by year is edited by admin)
            await conn.execute(
            "INSERT INTO studentCourses (student_id, course_id, doctor_id) VALUES (?, ?, ?)",
            [userId, course_id, doctor_id]
        );
    }
        //set firstlogin to false
        await conn.execute("UPDATE users SET is_firstlogin = FALSE WHERE id = ?", [userId]);

        await conn.commit();

        res.status(200).json({ 
            message: "Doctors selected successfully",
            selections: selections
        });
    } catch (error) {
        await conn.rollback();
    if (error.message === "USER_NOT_FOUND") {
        return res.status(404).json({ message: "User not found" });
    }

    if (error.message === "ALREADY_ASSIGNED") {
        return res.status(400).json({ message: "Doctors already selected" });
    }
        console.error("AssignDoctors error:", error.message);
        res.status(400).json({ message: "Server error" });    
    } finally {
        conn.release();
        }
    }





module.exports = { 
    AssignDoctors,
}