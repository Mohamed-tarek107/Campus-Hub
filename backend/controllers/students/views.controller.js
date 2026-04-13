const db = require("../../config/db");

// List all courses chosen by the student.
const viewAllstudent_courses = async (req, res) => {
    const user_id = req.user.id;
    try {
        const { rows: courses } = await db.query(
            `SELECT 
                c.id AS course_id,
                c.course_name,
                c.department,
                c.credit,
                c.year,
                d.name AS doctor_name,
                cd.id AS coursedoctor_id,
                sc.day,
                sc.timeslot
            FROM studentcourses sc
            JOIN courses c ON c.id = sc.course_id
            JOIN doctors d ON d.id = sc.doctor_id
            JOIN coursedoctors cd ON cd.course_id = sc.course_id AND cd.doctor_id = sc.doctor_id
            WHERE sc.student_id = $1`,
            [user_id]
        );

        if (courses.length === 0) return res.status(404).json({ message: "No courses found" });
        return res.status(200).json({ courses });

    } catch (error) {
        console.error("viewAllStudentCourses error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

// List all doctors chosen by the student.
const viewAllstudent_doctors = async (req, res) => {
    const user_id = req.user.id;
    try {
        const { rows: doctors } = await db.query(
            `SELECT d.*
            FROM studentCourses sc
            JOIN doctors d ON d.id = sc.doctor_id
            WHERE sc.student_id = $1`,
            [user_id]
        );

        if (doctors.length === 0) return res.status(404).json({ message: "No doctors found" });
        return res.status(200).json({ doctors });

    } catch (error) {
        console.error("viewAllStudent_doctors error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

// List all tasks related to the student's courses.
const viewAllstudent_tasks = async (req, res) => {
    const user_id = req.user.id;
    try {
        const { rows: studentTasks } = await db.query(
            `SELECT t.id, t.title, t.type, t.deadline, c.course_name, st.status
            FROM studentcourses sc
            JOIN coursedoctors cd ON cd.course_id = sc.course_id AND cd.doctor_id = sc.doctor_id
            JOIN tasks t ON t.coursedoctor_id = cd.id
            LEFT JOIN studenttasks st ON st.task_id = t.id AND st.student_id = sc.student_id
            JOIN courses c ON c.id = sc.course_id
            WHERE sc.student_id = $1`,
            [user_id]
        );

        if (studentTasks.length === 0) return res.status(404).json({ message: "No tasks found" });
        return res.status(200).json({ studentTasks });

    } catch (error) {
        console.error("viewAllStudent_tasks error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};


const markTaskDone = async (req,res) => {
    const user_id = req.user.id;
    try {
        const { task_id } = req.params

        const { rows: existingRows } = await db.query(
            "SELECT status FROM studenttasks WHERE task_id = $1 AND student_id = $2",
            [task_id, user_id]
        )

        let newStatus = 'done'

        if (existingRows.length === 0) {
            await db.query(
                "INSERT INTO studenttasks (student_id, task_id, status) VALUES ($1, $2, 'done')",
                [user_id, task_id]
            );
        } else if (existingRows[0].status === 'done') {
            newStatus = 'pending'
            await db.query(
                "UPDATE studenttasks SET status = 'pending' WHERE task_id = $1 AND student_id = $2",
                [task_id, user_id]
            )
        } else {
            await db.query(
                "UPDATE studenttasks SET status = 'done' WHERE task_id = $1 AND student_id = $2",
                [task_id, user_id]
            )
        }


        res.json({ message: `Task marked as ${newStatus}`, status: newStatus });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const viewDoneTasks = async (req,res) => {
    const user_id = req.user.id;

    try {
    const { rows: tasks } = await db.query(
        `SELECT
            t.id, t.title, t.type, t.deadline, c.course_name, st.status
            FROM studentcourses sc
            JOIN coursedoctors cd ON cd.course_id = sc.course_id AND cd.doctor_id = sc.doctor_id
            JOIN tasks t ON t.coursedoctor_id = cd.id
            LEFT JOIN studenttasks st ON st.task_id = t.id AND st.student_id = sc.student_id
            JOIN courses c ON c.id = sc.course_id
            WHERE sc.student_id = $1 AND st.status = 'done'`,
            [user_id]
        )

        res.status(200).json(tasks)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching done tasks" });
    }
}


const viewCourse_tasks = async (req, res) => {
    const user_id = req.user.id;
    const { coursedoctor_id } = req.params;
    try {
        const { rows: tasks } = await db.query(
            `SELECT 
                t.id AS task_id,
                t.title,
                t.type,
                t.deadline,
                COALESCE(st.status, 'pending') AS status
            FROM tasks t
            LEFT JOIN studenttasks st 
                ON st.task_id = t.id AND st.student_id = $1
            WHERE t.coursedoctor_id = $2`,
            [user_id, coursedoctor_id]
        );

        return res.status(200).json({ tasks });

    } catch (error) {
        console.error("viewCourseTasks error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { viewAllstudent_courses, viewAllstudent_doctors, viewAllstudent_tasks, markTaskDone, viewDoneTasks, viewCourse_tasks };
