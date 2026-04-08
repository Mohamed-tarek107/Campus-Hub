const express = require("express");
const { registerRoute, LoginRoute, refreshRoute, logout } = require("../controllers/auth.controller.js");
const {loginLimiter, registerLimiter } = require("../middlewares/authMiddleware")
const router = express.Router();


router.post("/register", registerRoute) // registerLimiter commented out for testing
router.post("/login", LoginRoute) // loginLimiter commented out for testing
router.post("/refresh-token", refreshRoute)
router.post("/logout", logout)

module.exports = router