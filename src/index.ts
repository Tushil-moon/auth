import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import path from "path";
import rateLimit from "express-rate-limit"
// import { fireapp } from "../../ngrx-auth/firebase";

const PORT = process.env.PORT || 8801;
const app = express();
 
// fireapp;   

// Middleware
app.use(bodyParser.json()); 

app.use(cors({
  origin: "*", // Allow all origins (consider specifying for production)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Rate limiting 
const limiter = rateLimit({
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
app.set("views", path.join(__dirname, "views"));

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
app.use("/api/auth", authRoutes);

// Start the server 
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

export default app; // Use export default for ES module syntax