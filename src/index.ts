import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import rateLimit from "express-rate-limit";
import dotenv from 'dotenv';
import { fireapp } from "./config/firebase";

dotenv.config(); // Load environment variables
fireapp;
const PORT = process.env.PORT || 8801;
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: "*", // Allow all origins
  methods: "GET,POST,PUT,DELETE,OPTIONS", // Allow all HTTP methods
  allowedHeaders: "*", // Allow all headers
}));

// Rate limiting 
const limiter = rateLimit({
  windowMs: 3000, // 15 minutes
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
  
  res.send('welcom to the server')
});

// Auth routes
app.use("/api/auth", authRoutes);

// Start the server 
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

export default app;