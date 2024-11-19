import express, { Request, Response, NextFunction } from "express";
import { login, register, sendNotification } from "../controllers/auth";
import { verifyToken } from "../middlewares/verifyToken";
import multer from "multer";
import { getMessage, getUser, uploadProfilePic } from "../controllers/user";
import { getUserChats } from "../utils/userChats";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Register a new user
router.post("/register", register);

// Upload profile picture
router.post("/upload", upload.single("file"), uploadProfilePic);

// Login a user
router.post("/login", login);

// Verify a user (with token)
router.post("/verifyuser", verifyToken);

// Send a notification
router.post("/send-notification", sendNotification);



export default router;
