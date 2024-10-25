import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import rateLimit from "express-rate-limit";
import dotenv from 'dotenv';
import multer from 'multer';
import { register } from "./controllers/auth";
import { fireapp } from "./services/uploadImage";

const upload = multer({ storage: multer.memoryStorage() });

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 8801;
const app = express();
fireapp;

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

app.post('/register', upload.single('profileImage'), register);

// Start the server 
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

export default app;