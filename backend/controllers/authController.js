const bcrypt = require("bcryptjs");
const db = require("../db.js");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const registerRoute = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array()
        });
    }

    const { username, phone_number, password, confirmpassword, department, year } = req.body

    if (password !== confirmpassword) return res.status(400).json({ message: "Password doesn't match confirmation" })

    try {
        const { rows: existingUser } = await db.query(
            "SELECT id FROM users WHERE username = $1", [username]
        )
        if (existingUser.length) return res.status(400).json({ message: "Username already registered" });

        const hashedPass = await bcrypt.hash(password, 12)

        await db.query(
            `INSERT INTO users (username, phone_number, hashedpass, department, year, is_firstlogin) VALUES($1, $2, $3, $4, $5, $6)`,
            [username, phone_number, hashedPass, department, year, true]
        )

        return res.status(201).json({ message: "User registered successfully" })
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

const LoginRoute = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array()
        });
    }

    const { username, password } = req.body

    try {
        const { rows: existingUser } = await db.query(
            "SELECT id, username, role, hashedpass, is_firstlogin FROM users WHERE username = $1", 
            [username]
        )
        if (existingUser.length === 0) return res.status(400).json({ message: "User not registered" });

        const user = existingUser[0]

        const isMatch = await bcrypt.compare(password, user.hashedpass)
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const userId = user.id;
        const UserRole = user.role;
        const payload = { id: userId, role: UserRole }

        const accessToken = jwt.sign(payload, process.env.JWT_AccessToken_SECRET, {
            subject: "accessToken",
            expiresIn: "15m"
        })

        const refreshToken = jwt.sign(payload, process.env.JWT_Refresh_SECRET, {
            subject: "refreshToken",
            expiresIn: "7d"
        })

        await db.query("DELETE FROM refreshtokens WHERE user_id = $1", [userId])
        await db.query(
            "INSERT INTO refreshtokens (user_id, refresh_token, ip_address) VALUES ($1, $2, $3)",
            [userId, refreshToken, req.ip]
        )

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: userId,
                role: UserRole,
                is_firstlogin: user.is_firstlogin
            }
        })
    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
}

const refreshRoute = async (req, res) => {
    const refreshtoken = req.cookies.refreshToken

    if (!refreshtoken) return res.status(401).json({ message: "No refresh token" });

    try {
        const { rows } = await db.query(
            "SELECT * FROM refreshtokens WHERE refresh_token = $1", [refreshtoken]
        )
        if (rows.length === 0) return res.status(403).json({ message: "Invalid refresh token" })

        let decoded;
        try {
            decoded = jwt.verify(refreshtoken, process.env.JWT_Refresh_SECRET)
        } catch (err) {
            await db.query("DELETE FROM refreshtokens WHERE refresh_token = $1", [refreshtoken])
            return res.status(403).json({ message: "Expired refresh token" })
        }

        const newAccessToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            process.env.JWT_AccessToken_SECRET,
            { subject: "accessToken", expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            process.env.JWT_Refresh_SECRET,
            { subject: "refreshToken", expiresIn: "7d" }
        );

        await db.query("DELETE FROM refreshtokens WHERE user_id = $1", [rows[0].user_id]);
        await db.query(
            "INSERT INTO refreshtokens (user_id, refresh_token, ip_address) VALUES ($1, $2, $3)",
            [decoded.id, newRefreshToken, req.ip]
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ message: "Token refreshed" })

    } catch (error) {
        console.error("Refresh error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(400).json({ message: "No refresh token found" });

        await db.query("DELETE FROM refreshtokens WHERE refresh_token = $1", [refreshToken])

        res.clearCookie("accessToken", { httpOnly: true, secure: false, sameSite: 'strict', path: "/" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: false, sameSite: 'strict', path: "/" });

        return res.status(200).json({ message: "Logged out" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = { registerRoute, LoginRoute, refreshRoute, logout }