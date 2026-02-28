const express = require("express");
const { editUserGpa } = require("../controllers/gpaCalc.js");
const { ensureAuthenticated } = require("../middlewares/authMiddleware.js")
const router = express.Router();


router.post("/assginGpa", ensureAuthenticated, editUserGpa)