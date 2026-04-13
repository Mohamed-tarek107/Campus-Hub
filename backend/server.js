const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const app = express();

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

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const normalizedOrigin = origin.replace(/\/+$/, "").toLowerCase();
        return callback(null, allowedOrigins.has(normalizedOrigin));
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

const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));