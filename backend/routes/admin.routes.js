const express = require("express");
const {
    addDoctor,
    addCourse,
    listAllcourses,
    courseDoctors,
    addAssignment,
    addEvent,
    listAllEvents,
    addAnnouncment,
    listAllAnnounces,
    deleteAnnouncment,
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

router.get("/listAllAnnounces", ensureAuthenticated, requireAdmin, listAllAnnounces)

router.post("/addAnnouncment", ensureAuthenticated, requireAdmin, addAnnouncment)

router.delete("/deleteEvent/:event_id", ensureAuthenticated, requireAdmin, deleteEvent)
router.delete("/deleteEvent/:announcment_id", ensureAuthenticated, requireAdmin, deleteAnnouncment)