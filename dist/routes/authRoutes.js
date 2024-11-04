"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const verifyToken_1 = require("../middlewares/verifyToken");
const multer_1 = __importDefault(require("multer"));
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Register a new user
router.post("/register", auth_1.register);
// Upload profile picture
router.post("/upload", upload.single("file"), user_1.uploadProfilePic);
// Login a user
router.post("/login", auth_1.login);
// Verify a user (with token)
router.post("/verifyuser", verifyToken_1.verifyToken);
// Send a notification
router.post("/send-notification", auth_1.sendNotification);
router.post('/messages', user_1.getMessage);
exports.default = router;
