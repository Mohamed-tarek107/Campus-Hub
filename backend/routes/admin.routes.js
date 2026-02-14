const express = require("express");
const {
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
} = require("../controllers/adminController.js");
const { ensureAuthenticated, requireAdmin } = require("../middlewares/authMiddleware")
const router = express.Router();

router.post("/addCourse", ensureAuthenticated, requireAdmin, addCourse)

router.get("/courses", ensureAuthenticated, requireAdmin, listAllcourses)

router.post("/addDoctor", ensureAuthenticated, requireAdmin, addDoctor)

router.get("/courses/:course_id/doctors", ensureAuthenticated, requireAdmin, courseDoctors)

router.post("/coursedoctor/:coursedoctor_id/tasks", ensureAuthenticated, requireAdmin, addAssignment)

router.get("/listAllEvents", ensureAuthenticated, requireAdmin,listAllEvents)

router.post("/addEvent",ensureAuthenticated, requireAdmin, addEvent)

router.get("/listAllAnnounces", ensureAuthenticated, requireAdmin, listAllAnnouncements)

router.post("/addAnnouncment", ensureAuthenticated, requireAdmin, addAnnouncement)


router.delete("/events/:event_id", ensureAuthenticated, requireAdmin, deleteEvent)
router.delete("/announcements/:announcement_id", ensureAuthenticated, requireAdmin, deleteAnnouncement)