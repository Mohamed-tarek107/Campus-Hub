const db = require("../../config/db");

// Assign selected doctors on first login.
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
        const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'saturday', 'sunday'];
        const validTimeSlots = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00'];
        if (!Array.isArray(selections) || selections.length === 0) throw new Error("NO_SELECTIONS");

        // Validate and save each selected doctor.
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
                "INSERT INTO studentCourses (student_id, course_id, doctor_id, day, timeslot) VALUES ($1, $2, $3, $4, $5)",
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

module.exports = { AssignDoctors };
