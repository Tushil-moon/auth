"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const responseFormatter_1 = require("../utils/responseFormatter");
// Load environment variables from .env file
(0, dotenv_1.config)();
const key = process.env.SECRET_KEY;
if (!key) {
    throw new Error("secret key not found");
}
const verifyToken = (req, res) => {
    const { token } = req.body; // Extract token from request body
    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }
    // Verify the JWT token
    jsonwebtoken_1.default.verify(token, key, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: "Invalid token." });
            return;
        }
        (0, responseFormatter_1.sendResponse)(res, {
            status: 200,
            message: "user verified",
            data: true
        });
    });
};
exports.verifyToken = verifyToken;
