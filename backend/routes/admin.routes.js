const express = require("express");
const {
    addDoctor,
    addCourse,
    listAllcourses,
    courseDoctors,

} = require("../controllers/adminController.js");
const { ensureAuthenticated, requireAdmin } = require("../middlewares/authMiddleware")
const router = express.Router();

router.post("/addCourse", ensureAuthenticated, requireAdmin, addCourse)

router.get("/courses", ensureAuthenticated, requireAdmin, listAllcourses)

router.post("/addDoctor", ensureAuthenticated, requireAdmin, addDoctor)

router.get("/courses/:course_id/doctors", ensureAuthenticated, requireAdmin, courseDoctors)