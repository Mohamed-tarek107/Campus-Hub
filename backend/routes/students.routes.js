const express = require("express");
const { AssignDoctors } = require("../controllers/students/assignDoctors.controller.js");
const { getCourseDoctors, getStudentCourses } = require("../controllers/students/catalog.controller.js");
const { viewAllstudent_courses, viewAllstudent_doctors, viewAllstudent_tasks, viewDoneTasks, markTaskDone, viewCourse_tasks } = require("../controllers/students/views.controller.js");
const { takeFeedback } = require("../controllers/students/feedback.controller.js");
const { ensureAuthenticated } = require("../middlewares/authMiddleware.js")
const router = express.Router();


router.post("/assignDoctors", ensureAuthenticated, AssignDoctors)
router.get("/available", ensureAuthenticated, getStudentCourses)
router.get("/:course_id/doctors", ensureAuthenticated, getCourseDoctors)
router.get("/viewAllStudentCourses", ensureAuthenticated, viewAllstudent_courses)
router.get("/viewAllStudentdoctors", ensureAuthenticated, viewAllstudent_doctors)
router.get("/viewAllStudenttasks", ensureAuthenticated, viewAllstudent_tasks)
router.post("/takeFeedback", ensureAuthenticated, takeFeedback)
router.post("/markTaskDone/:task_id", ensureAuthenticated, markTaskDone)
router.get("/viewDoneTasks", ensureAuthenticated, viewDoneTasks)
router.get("/viewCourseTasks/:coursedoctor_id", ensureAuthenticated, viewCourse_tasks)
module.exports = router