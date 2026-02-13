const express = require("express");
const { addDoctors, addCourse, listAllcourses } = require("../controllers/adminController.js");
const { ensureAuthenticated, requireAdmin } = require("../middlewares/authMiddleware")
const router = express.Router();


router.post("/addDoctor", ensureAuthenticated, requireAdmin, addDoctors)
router.post("/addCourse", ensureAuthenticated, requireAdmin, addCourse)
router.get("listAllCourses", ensureAuthenticated, requireAdmin, listAllcourses)