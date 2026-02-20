const express = require("express");
const { AssignDoctors, viewAllstudent_courses, viewAllstudent_doctors, viewAllstudent_tasks } = require("../controllers/students.js");
const { ensureAuthenticated } = require("../middlewares/authMiddleware.js")
const router = express.Router();


router.post("/assignDoctors", ensureAuthenticated, AssignDoctors)
router.get("/viewAllStudentCourses", ensureAuthenticated, viewAllstudent_courses)
router.get("/viewAllStudentdoctors", ensureAuthenticated, viewAllstudent_doctors)
router.get("/viewAllStudenttasks", ensureAuthenticated, viewAllstudent_tasks)