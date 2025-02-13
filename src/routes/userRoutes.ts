import express from "express";
import { findUserById } from "../controllers/user";

const router = express.Router();

router.get("/finduser",findUserById);

export default router;