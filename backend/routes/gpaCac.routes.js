const express = require("express");
const { editUserGpa, chatBot } = require("../controllers/AI_gpaCalc.controller.js");
const { ensureAuthenticated } = require("../middlewares/authMiddleware.js")
const router = express.Router();


router.post("/assginGpa", ensureAuthenticated, editUserGpa)
router.post("/aiChat", ensureAuthenticated, chatBot)
module.exports = router