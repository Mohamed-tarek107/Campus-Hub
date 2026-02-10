const bcrypt = require("bcryptjs");
const db = require("../db.js");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");



const registerRoute = async (req,res) => {
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

        if(exisitingUser.length) return res.status(400).json({ message: "username already registered" });


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

const LoginRoute = async (req,res) => {
    
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
        const [existingUser] = await db.execute("SELECT * FROM users WHERE username = ?", [username])

        if(existingUser.length === 0) return res.status(400).json({ message: "User not registered" });

        const user = existingUser[0]

        const isMatch = await bcrypt.compare(password, user.hashedPass)

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
            maxAge: 15 * 60 * 1000 
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

const refreshRoute = async (req,res) => {
    const refreshtoken = req.cookies.refreshToken
    

    if(!refreshtoken) return res.status(401).json({ message: "No Refreshtokens" });
    try {
        const [rows] = await db.execute(
            "SELECT * FROM refreshtokens WHERE refresh_token = ?",[refreshtoken]
        )

        if(rows.length === 0) return res.status(403).json({ message: "invalid refresh token" })

        jwt.verify(
            refreshtoken,
            process.env.JWT_Refresh_SECRET,
            async(err, decoded) => {
                if(err) return res.status(403).json({ message: "Expired refresh token" });

                const newAccessToken = jwt.sign(
                        { id: decoded.id }, 
                        accessTokenSECRET,
                        { subject: "accessToken", expiresIn: "15m" }
                    );
                const newRefreshToken = jwt.sign(
                        { id: decoded.id }, 
                        process.env.JWT_Refresh_SECRET,
                        { subject: "RefreshToken", expiresIn: "7d" }
                    );

                // Remove old refresh token used
                    await db.execute("DELETE FROM refreshtokens WHERE user_id = ?", [rows[0].user_id]);

                // Insert new refresh token
                    await db.execute(
                        "INSERT INTO refreshtokens (user_id, refresh_token, ip_address) VALUES (?,?,?)",
                        [decoded.id, newRefreshToken, req.ip]
                    );
                //  Update cookie
                    res.cookie("accessToken", newAccessToken, {
                        httpOnly: true,
                        secure: false, //true in prod
                        path: "/",
                        sameSite: "strict",
                        maxAge: 15 * 60 * 1000
                    });

                    res.cookie("refreshToken", newRefreshToken, {
                        httpOnly: true,
                        secure: false, //true in prod
                        path: "/",
                        sameSite: "strict",
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    });
        res.json({ message: "Refreshed Token"})
    
        })
    } catch (error) {
        console.error("Refresh error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

const logout = async (req,res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) return res.status(400).json({ message: "No refresh token found" });

        await db.execute( "DELETE FROM refreshtokens WHERE refresh_token = ?",
            [refreshToken]
        )

        res.clearCookie("accessToken", { httpOnly: true, secure: false, sameSite: 'strict', path: "/" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: false, sameSite: 'strict', path: "/"});

        return res.status(200).json({ message: "Logged Out" });
    } catch (error) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = { 
    registerRoute,
    LoginRoute,
    refreshRoute, 
    logout
}