const express = require("express");
const { AssignDoctors } = require("../controllers/courses.js");
const { ensureAuthenticated } = require("../middlewares/authMiddleware")
const router = express.Router();


router.get("/assignDoctors", ensureAuthenticated, AssignDoctors)
