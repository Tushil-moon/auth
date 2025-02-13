import express from "express";
import cluster from "cluster";
import os from "os";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import http from "http";
import { Server } from "socket.io";
import { socketService } from "./services/socketService";
import authenticateToken from "./middlewares/authorization";
import chatRoutes from "./routes/chatRoutes";
import userRoutes from "./routes/userRoutes";
import "./config/firebase";

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 8801;

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(`Worker ${worker.process.pid} died`);
    console.error(`Code: ${code}, Signal: ${signal}`);

    // Optionally restart the worker
    cluster.fork();
  });
} else {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
    connectionStateRecovery: {},
  });

  // Socket service setup
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

  // Chat and user routes with middleware
  app.use("/api/chat", authenticateToken, chatRoutes);
  
  app.use("/api/user", authenticateToken, userRoutes);

  // Start the server
  server.listen(PORT, () => {
    console.log(`Worker ${process.pid} started at http://localhost:${PORT}`);
  });
}
