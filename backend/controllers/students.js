const db = require("../db.js");

const AssignDoctors = async (req, res) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const userId = req.user.id;

        const { rows: userRows } = await client.query(
            "SELECT is_firstlogin FROM users WHERE id = $1",
            [userId]
        );
        if (userRows.length === 0) throw new Error("USER_NOT_FOUND");
        if (!userRows[0].is_firstlogin) throw new Error("ALREADY_ASSIGNED");

        const selections = req.body.selections;
        const validDays = ['monday','tuesday','wednesday','thursday','saturday','sunday']
        const validTimeSlots = ['08:00-10:00','10:00-12:00','12:00-14:00','14:00-16:00','16:00-18:00','18:00-20:00']
        if (!Array.isArray(selections) || selections.length === 0) throw new Error("NO_SELECTIONS");

        for (const sel of selections) {
            const { course_id, doctor_name, day, timeslot } = sel;
            if (!validDays.includes(day)) throw new Error("INVALID_DAY");
            if (!validTimeSlots.includes(timeslot)) throw new Error("INVALID_SLOT");

            const { rows: docRows } = await client.query(
                "SELECT id FROM doctors WHERE name = $1",
                [doctor_name]
            );
            if (docRows.length === 0) throw new Error(`Doctor ${doctor_name} not found`);

            const doctor_id = docRows[0].id;

            const { rows: coursesDocs } = await client.query(
                "SELECT course_id FROM coursedoctors WHERE doctor_id = $1 AND course_id = $2",
                [doctor_id, course_id]
            );
            if (coursesDocs.length === 0) throw new Error(`Doctor ${doctor_name} doesn't teach this course`);

            await client.query(
                "INSERT INTO studentCourses (student_id, course_id, doctor_id, day, timeslot) VALUES ($1, $2, $3)",
                [userId, course_id, doctor_id, day, timeslot]
            );
        }

        await client.query(
            "UPDATE users SET is_firstlogin = FALSE WHERE id = $1",
            [userId]
        );

        await client.query('COMMIT');
        res.status(200).json({ message: "Doctors selected successfully", selections });

    } catch (error) {
        await client.query('ROLLBACK');
        if (error.message === "USER_NOT_FOUND") return res.status(404).json({ message: "User not found" });
        if (error.message === "ALREADY_ASSIGNED") return res.status(400).json({ message: "Doctors already selected" });
        if (error.message === "NO_SELECTIONS") return res.status(400).json({ message: "No selections provided" });
        console.error("AssignDoctors error:", error.message);
        res.status(500).json({ message: "Server error" });
    } finally {
        client.release();
    }
};

const viewAllstudent_courses = async (req, res) => {
    const user_id = req.user.id;
    try {
        const { rows: courses } = await db.query(`
            SELECT c.*
            FROM studentCourses sc
            JOIN courses c ON c.id = sc.course_id
            WHERE sc.student_id = $1
        `, [user_id]);

        if (courses.length === 0) return res.status(404).json({ message: "No courses found" });
        return res.status(200).json({ courses });

    } catch (error) {
        console.error("viewAllStudentCourses error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const viewAllstudent_doctors = async (req, res) => {
    const user_id = req.user.id;
    try {
        const { rows: doctors } = await db.query(`
            SELECT d.*
            FROM studentCourses sc
            JOIN doctors d ON d.id = sc.doctor_id
            WHERE sc.student_id = $1
        `, [user_id]);

        if (doctors.length === 0) return res.status(404).json({ message: "No doctors found" });
        return res.status(200).json({ doctors });

    } catch (error) {
        console.error("viewAllStudent_doctors error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const viewAllstudent_tasks = async (req, res) => {
    const user_id = req.user.id;
    try {
        const { rows: studentTasks } = await db.query(`
            SELECT t.title, t.type, t.deadline, c.course_name, st.status
            FROM studentCourses sc
            JOIN courseDoctors cd ON cd.course_id = sc.course_id AND cd.doctor_id = sc.doctor_id
            JOIN tasks t ON t.coursedoctor_id = cd.id
            LEFT JOIN studentTasks st ON st.task_id = t.id AND st.student_id = sc.student_id
            JOIN courses c ON c.id = sc.course_id
            WHERE sc.student_id = $1
        `, [user_id]);

        if (studentTasks.length === 0) return res.status(404).json({ message: "No tasks found" });
        return res.status(200).json({ studentTasks });

    } catch (error) {
        console.error("viewAllStudent_tasks error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { AssignDoctors, viewAllstudent_courses, viewAllstudent_doctors, viewAllstudent_tasks };