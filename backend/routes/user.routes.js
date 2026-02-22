const express = require("express");
const router = express.Router();
const { editInfo, userInfo, deleteAccount } = require("../controllers/user.js")
const { ensureAuthenticated } = require("../middlewares/authMiddleware")


router.get("/userInfo", ensureAuthenticated, userInfo)

router.post("/editInfo", ensureAuthenticated, editInfo)

router.delete("/deleteAccount", deleteAccount)