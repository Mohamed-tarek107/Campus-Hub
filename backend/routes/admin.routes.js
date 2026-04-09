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
    listAllFeedbacks,
    deleteCourse,
    dashboardStats,
} = require("../controllers/admin.controller.js");
const { ensureAuthenticated, requireAdmin } = require("../middlewares/authMiddleware")
const router = express.Router();

router.post("/addCourse", ensureAuthenticated, requireAdmin, addCourse)

router.get("/courses", ensureAuthenticated, requireAdmin, listAllcourses)

router.post("/addDoctor", ensureAuthenticated, requireAdmin, addDoctor)

router.get("/courses/:course_id/doctors", ensureAuthenticated, requireAdmin, courseDoctors)

router.post("/coursedoctor/:coursedoctor_id/tasks", ensureAuthenticated, requireAdmin, addAssignment)

router.get("/listAllEvents", ensureAuthenticated, listAllEvents)

router.post("/addEvent", ensureAuthenticated, requireAdmin, addEvent)

router.get("/listAllAnnounces", ensureAuthenticated, listAllAnnouncements)

router.post("/addAnnouncment", ensureAuthenticated, requireAdmin, addAnnouncement)

router.get("/listFeedbacks", ensureAuthenticated, requireAdmin, listAllFeedbacks)

router.get("/dashbordStats", ensureAuthenticated, requireAdmin, dashboardStats)

router.delete("/events/:event_id", ensureAuthenticated, requireAdmin, deleteEvent)
router.delete("/announcements/:announcement_id", ensureAuthenticated, requireAdmin, deleteAnnouncement)
router.delete("/courses/:course_id", ensureAuthenticated, requireAdmin, deleteCourse)

module.exports = router