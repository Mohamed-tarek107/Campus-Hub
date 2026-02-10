const bcrypt = require("bcryptjs");
const db = require("../db.js");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const { decode } = require("punycode");


const register = async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array()
        });
    }

    const {
        username,
        phone_number,
        password,
        confirmpassword,
        department,
        year
    } = req.body

    if (!username ||
        !phone_number ||
        !password ||
        !confirmpassword ||
        !department ||
        !year ){
            return res.status(400).json({ message: "Validation failed" });
        }

    if(password != confirmpassword) return res.status(400).json({message: "Password Doesnt match confirmation"})
    

    try {
        const [exisitingUser] = await db.execute("SELECT * FROM users WHERE username = ?", [username])

        if(exisitingUser.length) return res.status(400).json({ message: "Email already registered" });


        const hashedPass = await bcrypt.hash(password, 12)

        await db.execute(`INSERT INTO users ( username, phone_number, hashedPass, department, year) VALUES(?, ?, ?, ?, ?)`,
            [username, phone_number, hashedPass, department, year]
        )

        return res.status(201).json({ message: "User registered successfully" })
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

const LoginUser = async (req,res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: "Validation failed",
            errors: errors.array()
        });
    }

    const {username, password} = req.body


    const accessTokenSECRET = process.env.JWT_AccessToken_SECRET;
    const refreshTokenSECRET = process.env.JWT_Refresh_SECRET;

    try {
        const [existingUser] = await db.execute("SELECT * FROM users WHERE username = ?", username)

        if(existingUser.length === 0) return res.status(400).json({ message: "User not registered" });

        const user = existingUser[0]

        const isMatch = await bcrypt.compare(password, user.password_hashed)

        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const userId = user.id

        const accessToken = jwt.sign({id: userId }, accessTokenSECRET, {
            subject: "RefreshToken",
            expiresIn: "15m"
        })

        const refreshToken = jwt.sign({ id: userId }, refreshTokenSECRET, {
            subject: "accessToken",
            expiresIn: "7d"
        })


        await db.execute("DELETE FROM refreshtokens WHERE user_id = ?",
            [existingUser[0].id]
        )
        await db.execute("INSERT INTO refreshtokens ( user_id, refresh_tokens, ip_address ) VALUES (?, ?, ?)", 
            [userId, refreshToken, req.ip]
        )

        res.cookie("refreshtoken", refreshToken, {
            httpOnly: true, //not accessible in js
            secure: true,
            path: "/", // only send to this endpoint ( ALL endpoint)
            sameSite: "strict", // prevent CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ayam
        })

        res.cookie("accessToken", accessToken,{
            httpOnly: true, //not accessible in js
            secure: true,
            path: "/", // only send to this endpoint ( ALL endpoint)
            sameSite: "strict", // prevent CSRF
            maxAge: 15 * 60 * 1000  // 7 ayam
        })

        return res.status(200).json({
            id: userId,
            message: "User Logged in successfully"
        })
    } catch (error) {
        console.error("Error Logging user:", error.message);
            return res.status(500).json({ message: "Server error" });
    }
}

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

        req.user = {id: decodedAccessToken.id, user_id: decodedAccessToken.id}
        next()
    } catch (error) {
        return res.status(401).json({ message: "access token invalid or expired" });
    }
}