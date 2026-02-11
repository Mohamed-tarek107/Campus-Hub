const bcrypt = require("bcryptjs");
const db = require("../db.js");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");


//MiddleWares

//All endpoints students/admins
async function ensureAuthenticated(req,res,next){
    const accessToken = req.cookies.accessToken


    if(!accessToken){
        console.warn('Access token cookie missing');
        return res.status(401).json({ message: "Access token not found!" });
    }

    try {
        const decodedAccessToken = jwt.verify(
        accessToken,
        process.env.JWT_AccessToken_SECRET
    );

        req.user = {id: decodedAccessToken.id, user_id: decodedAccessToken.id, role: decodedAccessToken.role}
        next()
    } catch (error) {
        return res.status(401).json({ message: "access token invalid or expired" });
    }
}

//admin enpoints Only
const requireAdmin = async (req,res,next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admins only" });
}
    next();
}


// Limiters
const loginLimiter = rateLimit({
    windowsMs: 15* 60 * 1000, //15 min
    max: 5,
    message: "Too many login attempts",
    legacyHeaders: false,
    skip: (req) => req.method !== "POST", // Only count POST
})

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 registrations per hour
    message: "Too many accounts created, try again later",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip
});



module.exports = { loginLimiter, registerLimiter, ensureAuthenticated, requireAdmin };