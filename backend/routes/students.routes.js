const express = require("express");
const { AssignDoctors, viewAllstudent_courses, viewAllstudent_doctors, viewAllstudent_tasks, getCourseDoctors, getStudentCourses } = require("../controllers/students.js");
const { ensureAuthenticated } = require("../middlewares/authMiddleware.js")
const router = express.Router();


router.post("/assignDoctors", ensureAuthenticated, AssignDoctors)
router.get("/available", ensureAuthenticated, getStudentCourses)
router.get("/:course_id/doctors", ensureAuthenticated, getCourseDoctors)
router.get("/viewAllStudentCourses", ensureAuthenticated, viewAllstudent_courses)
router.get("/viewAllStudentdoctors", ensureAuthenticated, viewAllstudent_doctors)
router.get("/viewAllStudenttasks", ensureAuthenticated, viewAllstudent_tasks)