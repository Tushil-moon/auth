import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import http from "http";
import { Server } from "socket.io";
import { socketService } from "./services/socketService";
import authenticateToken from "./middlewares/authorization";
import chatRoutes from "./routes/chatRoutes";

const PORT = process.env.PORT || 8801;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  connectionStateRecovery: {},
});
socketService(io);
// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "*",
  })
);

// Main route
app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

// Auth routes
app.use("/api/auth", authRoutes);

app.use("/api/chat", authenticateToken, chatRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

export default app;
