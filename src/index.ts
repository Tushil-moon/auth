import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { dbconnection } from "./config/database";
import rateLimit from "express-rate-limit";
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: '*', // Specify the allowed origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 

const limiter = rateLimit({
  windowMs:  1000, // 15 minutes
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
app.use(express.static(path.join(__dirname, "public")));

// Create an HTTP server
const server = http.createServer(app);    
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
app.use("/api/auth", authRoutes);

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
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
