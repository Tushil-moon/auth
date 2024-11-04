"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessage = exports.uploadProfilePic = exports.user = void 0;
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
const firebase_1 = __importDefault(require("../config/firebase"));
const responseFormatter_1 = require("../utils/responseFormatter");
const database_1 = require("../config/database");
// Initialize Firebase app
(0, app_1.initializeApp)(firebase_1.default.firebaseConfig);
const storage = (0, storage_1.getStorage)();
// Placeholder for a user function; implement as needed
const user = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.user = user;
const uploadProfilePic = (req, // Use CustomRequest to access file and userId
res) => __awaiter(void 0, void 0, void 0, function* () {
    //   console.log(req);
    // Get a connection to the database
    const connection = yield database_1.dbconnection.getConnection();
    try {
        if (!req.file) {
            return (0, responseFormatter_1.sendResponse)(res, {
                status: 400,
                message: "No file uploaded",
            });
        }
        const dateTime = Date.now();
        const storageRef = (0, storage_1.ref)(storage, `files/${req.file.originalname} ${dateTime}`);
        const metadata = {
            contentType: req.file.mimetype,
        };
        // Upload the file to Firebase Storage
        const snapshot = yield (0, storage_1.uploadBytesResumable)(storageRef, req.file.buffer, metadata);
        const downloadURL = yield (0, storage_1.getDownloadURL)(snapshot.ref);
        console.log("File uploaded!");
        // Get user ID from request
        const userId = req.body.id; // Ensure userId is set before reaching this point
        // Update the user's profile picture URL in the database
        const data = yield connection.execute("UPDATE users SET profileImage = ? WHERE id = ?", [downloadURL, userId]);
        const [updatedUser] = yield connection.execute("SELECT * FROM users WHERE id = ?", [userId]);
        return (0, responseFormatter_1.sendResponse)(res, {
            status: 200,
            message: "File uploaded successfully!",
            data: updatedUser,
        });
    }
    catch (error) {
        console.error("Error uploading file:", error); // Log the error for debugging
        return (0, responseFormatter_1.sendResponse)(res, {
            status: 400,
            message: error.message || "An error occurred while uploading.",
        });
    }
    finally {
        // Always release the database connection
        yield connection.release();
    }
});
exports.uploadProfilePic = uploadProfilePic;
const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderChatID, receiverChatID } = req.body;
    if (!senderChatID) {
        (0, responseFormatter_1.sendResponse)(res, {
            status: 400,
            message: "senderChatID is required",
        });
        return;
    }
    if (!receiverChatID) {
        (0, responseFormatter_1.sendResponse)(res, {
            status: 400,
            message: "receiverChatID is required",
        });
        return;
    }
    let connection;
    try {
        connection = yield database_1.dbconnection.getConnection();
        // Query to fetch messages between sender and receiver
        const [messages] = yield connection.query(`
      SELECT * FROM messages 
      WHERE (senderChatID = ? AND receiverChatID = ?) 
         OR (senderChatID = ? AND receiverChatID = ?)
      ORDER BY created_at ASC
    `, [senderChatID, receiverChatID, receiverChatID, senderChatID]);
        return (0, responseFormatter_1.sendResponse)(res, {
            status: 200,
            message: 'Message fetch successfully',
            data: {
                messages
            }
        }); // Return the list of messages
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        throw error; // Rethrow error to handle it outside
    }
    finally {
        if (connection) {
            connection.release();
        }
    }
});
exports.getMessage = getMessage;
