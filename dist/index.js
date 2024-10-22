"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_1 = require("./config/firebase");
dotenv_1.default.config(); // Load environment variables
firebase_1.fireapp;
const PORT = process.env.PORT || 8801;
const app = (0, express_1.default)();
// Middleware
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: ["*"], // Adjust for production
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Rate limiting 
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        status: 429,
        error: "Too many requests, please try again later.",
    },
    headers: true,
});
app.use(limiter);
// Main route
app.get("/", (req, res) => {
    res.send('welcom to the server');
});
// Auth routes
app.use("/api/auth", authRoutes_1.default);
// Start the server 
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
exports.default = app;
