const db = require("../../config/db");

// Get courses available for the logged-in student.
const getStudentCourses = async (req, res) => {
    const user_id = req.user.id;
    try {
        const { rows: user } = await db.query(
            `SELECT department, year FROM users WHERE id = $1`,
            [user_id]
        );

        if (user.length === 0) return res.status(404).json({ message: "User not found" });

        const { rows: courses } = await db.query(
            "SELECT id, course_name FROM courses WHERE department = $1 AND year = $2",
            [user[0].department, user[0].year]
        );

        if (courses.length === 0) return res.status(404).json({ message: "No courses found for your department and year" });
        return res.status(200).json({ courses });
    } catch (error) {
        console.error("getStudentCourses error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

// Get doctors assigned to one course.
const getCourseDoctors = async (req, res) => {
    const { course_id } = req.params;
    try {
        const { rows: doctors } = await db.query(
            `SELECT d.id, d.name
            FROM coursedoctors cd
            JOIN doctors d ON cd.doctor_id = d.id
            WHERE cd.course_id = $1`,
            [course_id]
        );

        if (doctors.length === 0) return res.status(404).json({ message: "No doctors assigned to this course" });
        return res.status(200).json({ doctors });
    } catch (error) {
        console.error("getDoctorsForCourse error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getStudentCourses, getCourseDoctors };
