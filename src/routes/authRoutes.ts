import express from "express";
import { login, register } from "../controllers/auth";
import { verifyToken } from "../middlewares/verifyToken";
import { sendNotification } from "../services/notification";

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login a user
router.post("/login", login);

// Verify a user
router.post("/verifyuser", verifyToken);

// Send Notification

router.post("/send-notification", sendNotification);

export default router;
