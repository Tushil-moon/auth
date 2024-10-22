"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const verifyToken_1 = require("../middlewares/verifyToken");
const notification_1 = require("../services/notification");
const router = express_1.default.Router();
// Register a new user
router.post("/register", auth_1.register);
// Login a user
router.post("/login", auth_1.login);
// Verify a user
router.post("/verifyuser", verifyToken_1.verifyToken);
// Send Notification
router.post("/send-notification", notification_1.sendNotification);
exports.default = router;
