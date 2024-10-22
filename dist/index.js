"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const path_1 = __importDefault(require("path"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const firebase_1 = require("./config/firebase");
const PORT = process.env.PORT || 8801;
const app = (0, express_1.default)();
firebase_1.fireapp;
// Middleware
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: "*", // Allow all origins (consider specifying for production)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Rate limiting 
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1000, // 1 second
    max: 100, // Limit each IP to 100 requests per windowMs 
    message: {
        status: 429,
        error: "Too many requests, please try again later.",
    },
    headers: true, // Send rate limit info in the headers
});
app.use(limiter);
// Set up EJS view engine
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "views"));
// Define available routes
const routes = [
    { path: "/api/auth/login", name: "Login" },
    { path: "/api/auth/register", name: "Register" }, // Fixed duplicate name
    { path: "/api/auth/verify", name: "Verify" }, // Fixed duplicate name
];
// Main route
app.get("/", (req, res) => {
    const data = {
        title: "AUTH REST-Api",
        message: "Welcome to the REST API!",
        routes, // Pass routes to the index.ejs template
    };
    res.render("index", data); // Now the routes variable will be accessible in index.ejs
});
// Auth routes
app.use("/api/auth", authRoutes_1.default);
// Start the server 
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
exports.default = app; // Use export default for ES module syntax
