import express from "express";
import { getMessage, getUser } from "../controllers/user";

const router = express.Router();
// Send messages
router.post("/messages", getMessage);

// send users list
router.post("/chats", getUser);

export default router;
