const express = require("express");
const router = express.Router();
const { editInfo, userInfo, deleteAccount, changepass } = require("../controllers/user.js")
const { ensureAuthenticated } = require("../middlewares/authMiddleware")


router.get("/userInfo", ensureAuthenticated, userInfo)

router.patch("/editInfo", ensureAuthenticated, editInfo)

router.patch("/changePassword", ensureAuthenticated, changepass)

router.delete("/deleteAccount", deleteAccount)