const db = require("../../config/db");

// List all courses chosen by the student.
const viewAllstudent_courses = async (req, res) => {
    const user_id = req.user.id;
    try {
        const { rows: courses } = await db.query(
            `SELECT c.*
            FROM studentCourses sc
            JOIN courses c ON c.id = sc.course_id
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
            `SELECT t.title, t.type, t.deadline, c.course_name, st.status
            FROM studentCourses sc
            JOIN courseDoctors cd ON cd.course_id = sc.course_id AND cd.doctor_id = sc.doctor_id
            JOIN tasks t ON t.coursedoctor_id = cd.id
            LEFT JOIN studentTasks st ON st.task_id = t.id AND st.student_id = sc.student_id
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

module.exports = { viewAllstudent_courses, viewAllstudent_doctors, viewAllstudent_tasks };
