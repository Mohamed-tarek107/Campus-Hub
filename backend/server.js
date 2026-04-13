const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

// Only load .env file in local development
// In production (Railway), variables are injected directly into process.env
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: path.join(__dirname, ".env") });
}

const app = express();
const isProduction = process.env.NODE_ENV?.trim() === "production";

// Log env check on startup to verify variables are loaded
console.log("Environment:", process.env.NODE_ENV);
console.log("DB connected:", !!process.env.DATABASE_URL);
console.log("JWT loaded:", !!process.env.JWT_AccessToken_SECRET);

// ── CORS ──────────────────────────────────────────────
const allowedOrigins = new Set([
    "http://localhost:4200",
    "https://campus-hub-bis.netlify.app",
    process.env.FRONTEND_URL,
    process.env.FRONTEND_PROD_URL,
].filter(Boolean).map(o => o.replace(/\/+$/, "").toLowerCase()));

const corsOptions = {
    origin: (origin, callback) => {
        // allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        const normalized = origin.replace(/\/+$/, "").toLowerCase();

        // allow any netlify preview deploy URL
        if (/^https:\/\/.*\.netlify\.app$/i.test(normalized)) {
            return callback(null, true);
        }

        if (allowedOrigins.has(normalized)) {
            return callback(null, true);
        }

        console.warn("CORS blocked origin:", origin);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(helmet());
app.use(cors(corsOptions));

// Handle preflight requests explicitly


app.use(cookieParser());
app.use(express.json());

// ── Routes ────────────────────────────────────────────
const authRoutes    = require("./routes/auth.routes.js");
const adminRoutes   = require("./routes/admin.routes.js");
const studentRoutes = require("./routes/students.routes.js");
const userRoutes    = require("./routes/user.routes.js");
const gpaRoutes     = require("./routes/gpaCac.routes.js");

app.get("/",        (req, res) => res.send("Server is running..."));
app.get("/health",  (req, res) => res.status(200).json({ status: "ok", env: process.env.NODE_ENV }));

app.use("/api/auth",    authRoutes);
app.use("/api/admin",   adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/user",    userRoutes);
app.use("/api/gpa",     gpaRoutes);

// ── 404 ───────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// ── Global error handler ──────────────────────────────
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).json({ message: "Something went wrong" });
});

// ── Start ─────────────────────────────────────────────
const PORT = process.env.PORT || process.env.SERVER_PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));