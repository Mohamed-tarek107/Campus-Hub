const express = require("express");
const { addDoctors } = require("../controllers/adminController.js");
const { ensureAuthenticated, requireAdmin } = require("../middlewares/authMiddleware")
const router = express.Router();


router.post("/addDoctors", ensureAuthenticated, requireAdmin, addDoctors)
