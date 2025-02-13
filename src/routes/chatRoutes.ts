import express from "express";
import { deleteMsgById, getMessage, getUser, getUserNewChats } from "../controllers/user";

const router = express.Router();
// Send messages
router.post("/messages", getMessage);

// send users list
router.post("/chats", getUser);

// delete messages
router.get("/deletemessage", deleteMsgById);

router.post("/userchats", getUserNewChats)
export default router;
