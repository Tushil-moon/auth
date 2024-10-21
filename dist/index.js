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
require('dotenv').config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: '*', // Specify the allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        error: "Too many requests, please try again later.",
    },
    headers: true, // Add X-RateLimit headers to responses
});
// Apply the rate limiter to all requests
app.use(limiter);
// Serve static files from the "public" directory
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// Create an HTTP server
// const server = http.createServer(app);    
// const io = new Server(server, {
//   connectionStateRecovery: {
//     // the backup duration of the sessions and the packets
//     maxDisconnectionDuration: 2 * 60 * 1000,
//     // whether to skip middlewares upon successful recovery
//     skipMiddlewares: true,
//   },
//   cors: {
//     origin: "*", // Replace with the origin you are using
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });
app.get('/', (req, res) => {
    res.send('Hello from Vercel!');
});
app.use("/api/auth", authRoutes_1.default);
// app.get("/messages", async (req, res) => {
//   const db = await dbconnection.getConnection();
//   const result = await db.execute(
//     "SELECT * FROM messages ORDER BY created_at DESC"
//   );
//   res.json(result);
// });
// Socket.IO connection
// io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);
//     socket.on("chatMessage", async (msg) => {
//       console.log("Message received:", msg);
//       try {
//         const { username, message } = msg;
//         // Get the database connection
//         const db = await dbconnection.getConnection();
//         // Execute the query to insert the message
//         await db.execute("INSERT INTO messages (username, message) VALUES (?, ?)", [
//           username,
//           message,
//         ]);
//         console.log("Successfully saved message");
//         // Emit the message to all connected clients
//         io.emit("chatMessage", msg);
//         // Release the database connection after the query
//         db.release();
//       } catch (error) {
//         console.error("Error saving message:", error);
//       }
//     });
//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });
// Start the server
const PORT = process.env.PORT || 8801; // Ensure you use the same port
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
module.exports = app;
