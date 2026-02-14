const db = require("../db.js");


const addDoctor = async (req,res) => {
    const user_id = req.user.id
    const conn = await db.getConnection()
    try {
        await conn.beginTransaction();
        //CHECK ADMIN
        const [user] = await conn.execute("SELECT role FROM users WHERE id = ?", [user_id])
        if (user.length === 0) throw new Error("USER_NOT_FOUND");
        if (user[0].role !== 'admin') throw new Error("FORBIDDEN");

        //validate input
        const {course_id , doctor_name } = req.body
        if(!course_id || !doctor_name ) throw new Error("MISSING_DATA");
        //ensure course exist
        const [courses] = await conn.execute("SELECT id FROM courses WHERE id = ?",
            [course_id]
        );

        if (courses.length == 0) throw new Error("COURSE_NOT_FOUND");
        //insert doctor if not existed
        let [doctors] = await conn.execute("SELECT id FROM doctors WHERE name = ?",
            [doctor_name]
        );

        if (doctors.length === 0) {
                await conn.execute("INSERT INTO doctors (name) VALUES (?)",
                [doctor_name]
            );
            [doctors] = await conn.execute("SELECT id FROM doctors WHERE name = ?",
                [doctor_name]
            )
        }

        const doctor_id = doctors[0].id;

        // prevent dublicates
        const [exists] = await conn.execute("SELECT 1 FROM coursedoctors WHERE course_id = ? AND doctor_id = ?", [course_id, doctor_id])
        if(exists.length > 0) throw new Error("ALREADY_ASSIGNED");

        //link doctors to courses
        await conn.execute(
            "INSERT INTO coursedoctors (course_id, doctor_id) VALUES (?,?) ",
            [course_id, doctor_id]
        );

        await conn.commit();
        res.status(201).json({ 
            message: "Doctor added to course",
            doctor_id,
            course_id
        });

    } catch (error) {
        await conn.rollback();

        if (error.message === "USER_NOT_FOUND")
        return res.status(404).json({ message: "User not found" });

    if (error.message === "FORBIDDEN")
        return res.status(403).json({ message: "Admin only" });

    if (error.message === "COURSE_NOT_FOUND")
        return res.status(404).json({ message: "Course not found" });

    if (error.message === "ALREADY_ASSIGNED")
        return res.status(400).json({ message: "Doctor already assigned to this course" });

    } finally {
        conn.release();
    }
}

const addCourse = async (req,res) => {
    const user_id = req.user.id
    const conn = await db.getConnection()
    //check admin
    try {
        await conn.beginTransaction()
    const [user] = await conn.execute("SELECT role FROM users WHERE id = ?", [user_id])
        if (user.length === 0) throw new Error("USER_NOT_FOUND");
        if (user[0].role !== 'admin') throw new Error("FORBIDDEN");

    //validate input
    const { course_name, department, year } = req.body
    if( !course_name || !department || !year) throw new Error("Missing_Inputs")
    
    //check if existed
    const [courses] = await conn.execute("SELECT course_name FROM courses WHERE course_name = ? AND department = ? AND year = ?",
        [course_name, department, year]
    )
    if(courses.length > 0) throw new Error("Course_alreadyExist")
    
    await conn.execute("INSERT INTO courses (course_name, department, year) VALUES (?, ?, ?)", [course_name, department, year])


    await conn.commit();
    res.status(201).json({ message: "Course Added Successfully" });

    } catch (error) {
    await conn.rollback()
    if (error.message === "USER_NOT_FOUND")
        return res.status(404).json({ message: "User not found" });
    if (error.message === "FORBIDDEN")
        return res.status(403).json({ message: "Admin only" });

    if (error.message === "Missing_Inputs")
        return res.status(400).json({ message: "Missing Inputs" });

    if (error.message === "Course_alreadyExist")
        return res.status(400).json({ message: "Course already exist" })

        console.error("AssignDoctors error:", error.message);
        res.status(400).json({ message: "Server error" });  
    } finally {
        conn.release();
    }
    
    

}

const listAllcourses = async (req,res) => {
    try {
    const user_id = req.user.id
    const [user] = await db.execute("SELECT role FROM users WHERE id = ?", [user_id])
        if (user.length === 0) return res.status(404).json({ message: "User not found" });
        if (user[0].role !== 'admin') return res.status(403).json({ message: "Admin only" });

    const [courses] = await db.execute("SELECT * FROM courses")
    if(courses.length == 0) return res.status(404).json({ message: "No Courses Added :(" })
    
        res.status(200).json({ courses })
    } catch (error) {
        console.error("ListAllCourses error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
    
}

const courseDoctors = async (req,res) => {
    const user_id = req.user.id
    const  { course_id } = req.params
    try {
        const [user] = await db.execute("SELECT role FROM users WHERE id = ?", [user_id])
        if (user.length === 0) return res.status(404).json({ message: "User not found" });
        if (user[0].role !== 'admin') return res.status(403).json({ message: "Admin only" });

// -------- EXPECTED RESPONSE 
    // [
    //   { "coursedoctor_id": 7, "doctor_id": 3, "name": "Dr Ahmed" },
    //   { "coursedoctor_id": 8, "doctor_id": 5, "name": "Dr Sara" }
    // ]
        const [doctors] = await db.execute(`
            SELECT cd.id AS coursedoctor_id, d.id AS doctor_id, d.name
            FROM coursedoctors cd
            JOIN doctors d ON cd.doctor_id = d.id
            WHERE cd.course_id = ?`,
            [course_id]
        )
        if(doctors.length == 0) return res.status(404).json({ message: "No doctors are assigned to this course yet"})
            res.status(200).json({ doctors })
    } catch (error) {
        console.error("courseDoctors error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
}

const addAssignment = async (req,res) => {
    const { coursedoctor_id } = req.params
    const user_id = req.user.id

    const conn = await db.getConnection()
    try {
        await conn.beginTransaction()
        const [user] = await conn.execute("SELECT role FROM users WHERE id = ?", [user_id])
        if (user.length === 0) return res.status(404).json({ message: "User not found" });
        if (user[0].role !== 'admin') return res.status(403).json({ message: "Admin only" });

        //input 
        const {title , deadline, type, details } = req.body
        if(!title || !deadline || !type || !details) throw new Error("Missing_Input")
        const types = ['exam', 'assignment', 'project']
        if (!types.includes(type)) {
            throw new Error("Invalid_task_type")
        }
        
        
        const [exists] = await conn.execute(
            "SELECT id FROM coursedoctors WHERE id = ?",
            [coursedoctor_id]
        );
        if (exists.length === 0) throw new Error("COURSE_DOCTOR_NOT_FOUND");

        await conn.execute(
            "INSERT INTO tasks (coursedoctor_id, type, details, title, deadline) VALUES (?, ?, ?, ?, ?)",
            [coursedoctor_id, type, details, title, deadline]
        );
        conn.commit()
        res.status(200).json({ message: "Task created successfully"})

    } catch (error) {
        await conn.rollback()
        console.error("courseDoctors error:", error.message);
        res.status(500).json({ message: "Server error" });
    }


}

module.exports = {
    addDoctor,
    addCourse,
    listAllcourses,
    courseDoctors,
    addAssignment
}