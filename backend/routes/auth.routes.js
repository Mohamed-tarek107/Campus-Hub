const express = require("express");
const { registerRoute, LoginRoute , refreshRoute, logout } = require("../controllers/authController");
const {loginLimiter, registerLimiter } = require("../middlewares/authMiddleware")
const router = express.Router();


router.post("/register", registerLimiter, registerRoute)
router.post("/login", loginLimiter, LoginRoute)
router.post("/refresh-token", refreshRoute)
router.post("/logout", logout)