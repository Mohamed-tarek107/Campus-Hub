const bcrypt = require("bcryptjs");
const db = require("../db.js");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const crypto = require("crypto");


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

}