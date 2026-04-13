const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const app = express();
const isProduction = process.env.NODE_ENV?.trim() === "production";

const normalizeOriginValues = (value) => {
    if (!value) return [];

    const trimmed = value.trim().replace(/\/+$/, "");
    if (!trimmed) return [];

    if (/^https?:\/\//i.test(trimmed)) {
        try {
            return [new URL(trimmed).origin.toLowerCase()];
        } catch {
            return [];
        }
    }

    // If scheme is omitted in env vars, allow both for resilience.
    return [`https://${trimmed}`.toLowerCase(), `http://${trimmed}`.toLowerCase()];
};

const allowedOrigins = new Set([
    ...normalizeOriginValues(process.env.FRONTEND_URL),
    ...normalizeOriginValues(process.env.FRONTEND_PROD_URL),
    "http://localhost:4200",
    "https://campus-hub-bis.netlify.app"
].map((origin) => origin.toLowerCase()));

const isAllowedOrigin = (origin) => {
    if (!origin || typeof origin !== "string") return true;

    // Temporary production fail-open to avoid blocking cross-origin clients on deployment.
    // Keep credentials enabled while reflecting caller origin.
    if (isProduction) return true;

    const normalizedOrigin = origin.replace(/\/+$/, "").toLowerCase();
    if (allowedOrigins.has(normalizedOrigin)) return true;

    // Safety fallback for Netlify preview deploy URLs in production.
    return /^https:\/\/.*\.netlify\.app$/i.test(normalizedOrigin);
};

const corsOptions = {
    origin: (origin, callback) => {
        try {
            return callback(null, isAllowedOrigin(origin));
        } catch (error) {
            console.error("CORS origin check failed:", error.message);
            return callback(null, false);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth.routes.js");
const adminRoutes = require("./routes/admin.routes.js");
const studentRoutes = require("./routes/students.routes.js");
const userRoutes = require("./routes/user.routes.js");
const gpaRoutes = require("./routes/gpaCac.routes.js");

app.get("/", (req, res) => res.send("Server is running..."));
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/gpa", gpaRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || process.env.SERVER_PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));