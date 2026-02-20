const db = require("../db.js");

const addDoctor = async (req, res) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const { course_id, doctor_name } = req.body;
        if (!course_id || !doctor_name) throw new Error("MISSING_DATA");

        const { rows: courses } = await client.query(
            "SELECT id FROM courses WHERE id = $1",
            [course_id]
        );
        if (courses.length == 0) throw new Error("COURSE_NOT_FOUND");

        let { rows: doctors } = await client.query(
            "SELECT id FROM doctors WHERE name = $1",
            [doctor_name]
        );

        if (doctors.length === 0) {
            await client.query(
                "INSERT INTO doctors (name) VALUES ($1)",
                [doctor_name]
            );
            const { rows: newDoctor } = await client.query(
                "SELECT id FROM doctors WHERE name = $1",
                [doctor_name]
            );
            doctors = newDoctor;
        }

        const doctor_id = doctors[0].id;

        const { rows: exists } = await client.query(
            "SELECT 1 FROM coursedoctors WHERE course_id = $1 AND doctor_id = $2",
            [course_id, doctor_id]
        );
        if (exists.length > 0) throw new Error("ALREADY_ASSIGNED");

        await client.query(
            "INSERT INTO coursedoctors (course_id, doctor_id) VALUES ($1, $2)",
            [course_id, doctor_id]
        );

        await client.query('COMMIT');
        res.status(201).json({ message: "Doctor added to course", doctor_id, course_id });

    } catch (error) {
        await client.query('ROLLBACK');
        if (error.message === "COURSE_NOT_FOUND")
            return res.status(404).json({ message: "Course not found" });
        if (error.message === "ALREADY_ASSIGNED")
            return res.status(400).json({ message: "Doctor already assigned to this course" });
        console.error("addDoctor error:", error.message);
        return res.status(500).json({ message: "Server error" });
    } finally {
        client.release();
    }
};

const addCourse = async (req, res) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const { course_name, department, year } = req.body;
        if (!course_name || !department || !year) throw new Error("Missing_Inputs");

        const { rows: courses } = await client.query(
            "SELECT course_name FROM courses WHERE course_name = $1 AND department = $2 AND year = $3",
            [course_name, department, year]
        );
        if (courses.length > 0) throw new Error("Course_alreadyExist");

        await client.query(
            "INSERT INTO courses (course_name, department, year) VALUES ($1, $2, $3)",
            [course_name, department, year]
        );

        await client.query('COMMIT');
        res.status(201).json({ message: "Course Added Successfully" });

    } catch (error) {
        await client.query('ROLLBACK');
        if (error.message === "USER_NOT_FOUND")
            return res.status(404).json({ message: "User not found" });
        if (error.message === "FORBIDDEN")
            return res.status(403).json({ message: "Admin only" });
        if (error.message === "Missing_Inputs")
            return res.status(400).json({ message: "Missing Inputs" });
        if (error.message === "Course_alreadyExist")
            return res.status(400).json({ message: "Course already exist" });
        console.error("addCourse error:", error.message);
        res.status(500).json({ message: "Server error" });
    } finally {
        client.release();
    }
};

const listAllcourses = async (req, res) => {
    try {
        const { rows: courses } = await db.query("SELECT * FROM courses");
        if (courses.length == 0)
            return res.status(404).json({ message: "No Courses Added :(" });

        res.status(200).json({ courses });
    } catch (error) {
        console.error("ListAllCourses error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const courseDoctors = async (req, res) => {
    const { course_id } = req.params;
    try {
        const { rows: doctors } = await db.query(
            `SELECT cd.id AS coursedoctor_id, d.id AS doctor_id, d.name
             FROM coursedoctors cd
             JOIN doctors d ON cd.doctor_id = d.id
             WHERE cd.course_id = $1`,
            [course_id]
        );
        if (doctors.length == 0)
            return res.status(404).json({ message: "No doctors are assigned to this course yet" });

        res.status(200).json({ doctors });
    } catch (error) {
        console.error("courseDoctors error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const addAssignment = async (req, res) => {
    const { coursedoctor_id } = req.params;
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const { title, deadline, type, details } = req.body;
        if (!title || !deadline || !type || !details) throw new Error("Missing_Input");

        const types = ["exam", "assignment", "project"];
        if (!types.includes(type)) throw new Error("Invalid_task_type");

        const { rows: exists } = await client.query(
            "SELECT id FROM coursedoctors WHERE id = $1",
            [coursedoctor_id]
        );
        if (exists.length === 0) throw new Error("COURSE_DOCTOR_NOT_FOUND");

        await client.query(
            "INSERT INTO tasks (coursedoctor_id, type, details, title, deadline) VALUES ($1, $2, $3, $4, $5)",
            [coursedoctor_id, type, details, title, deadline]
        );

        await client.query('COMMIT');
        res.status(201).json({ message: "Task created successfully" });

    } catch (error) {
        await client.query('ROLLBACK');
        if (error.message === "Missing_Input")
            return res.status(400).json({ message: "Missing input" });
        if (error.message === "Invalid_task_type")
            return res.status(400).json({ message: "Invalid task type" });
        if (error.message === "COURSE_DOCTOR_NOT_FOUND")
            return res.status(404).json({ message: "Course doctor not found" });
        console.error("addAssignment error:", error.message);
        return res.status(500).json({ message: "Server error" });
    } finally {
        client.release();
    }
};

const addEvent = async (req, res) => {
    try {
        const { title, description, location, host, date } = req.body;
        if (!title || !description || !location || !host || !date)
            return res.status(400).json({ message: "Missing input" });

        await db.query(
            "INSERT INTO events (title, description, location, host, date) VALUES ($1, $2, $3, $4, $5)",
            [title, description, location, host, date]
        );

        res.status(201).json({ message: "Event created successfully" });
    } catch (error) {
        console.error("addEvent error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const listAllEvents = async (req, res) => {
    try {
        const { rows: events } = await db.query("SELECT * FROM events");
        if (events.length == 0)
            return res.status(404).json({ message: "No Events Added :(" });

        res.status(200).json({ events });
    } catch (error) {
        console.error("ListAllEvents error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const addAnnouncement = async (req, res) => {
    try {
        const { title, description, source, date } = req.body;
        if (!title || !description || !source || !date)
            return res.status(400).json({ message: "Missing input" });

        await db.query(
            "INSERT INTO announcements (title, description, source, date) VALUES ($1, $2, $3, $4)",
            [title, description, source, date]
        );

        res.status(201).json({ message: "Announcement created successfully" });
    } catch (error) {
        console.error("addAnnouncement error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const listAllAnnouncements = async (req, res) => {
    try {
        const { rows: announcements } = await db.query("SELECT * FROM announcements");
        if (announcements.length == 0)
            return res.status(404).json({ message: "No announcements Added :(" });

        res.status(200).json({ announcements });
    } catch (error) {
        console.error("ListAllAnnouncements error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { event_id } = req.params;
        const { rowCount } = await db.query(
            "DELETE FROM events WHERE id = $1",
            [event_id]
        );
        if (rowCount === 0) return res.status(404).json({ message: "Event not found" });

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("deleteEvent error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteAnnouncement = async (req, res) => {
    try {
        const { announcement_id } = req.params;
        const { rowCount } = await db.query(
            "DELETE FROM announcements WHERE id = $1",
            [announcement_id]
        );
        if (rowCount === 0) return res.status(404).json({ message: "Announcement not found" });

        res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (error) {
        console.error("deleteAnnouncement error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    addDoctor,
    addCourse,
    listAllcourses,
    courseDoctors,
    addAssignment,
    addEvent,
    listAllEvents,
    addAnnouncement,
    listAllAnnouncements,
    deleteAnnouncement,
    deleteEvent,
};