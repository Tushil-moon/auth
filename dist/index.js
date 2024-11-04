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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const database_1 = require("./config/database");
const PORT = process.env.PORT || 8801;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
// Middleware
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "*",
}));
const users = {}; // Store users with their chatIDs
// Socket.IO logic
io.on("connection", (socket) => {
    // Get the chatID from query parameters and join the corresponding room
    const chatID = socket.handshake.query.chatID;
    if (chatID) {
        socket.join(chatID);
        users[chatID] = socket.id; // Add user to the list
        // Emit the updated user list to all connected users
        io.emit("user_list", Object.keys(users));
    }
    // Leave the room when the user disconnects
    socket.on("disconnect", () => {
        socket.leave(chatID);
    });
    socket.on("typing", (id) => {
        console.log("typing..", id);
        socket.to(id.chatID).emit("receive_type", true);
    });
    // Send message to a specific user in a room
    socket.on("send_message", (message) => __awaiter(void 0, void 0, void 0, function* () {
        const { receiverChatID, senderChatID, content, status } = message;
        console.log(message);
        // Ensure receiverChatID is provided before emitting the message
        if (receiverChatID) {
            let connection; // Declare connection variable
            try {
                connection = yield database_1.dbconnection.getConnection();
                // Insert the message into the database
                const [result] = yield connection.query(`
          INSERT INTO messages (senderChatID, receiverChatID, content, status)
          VALUES (?, ?, ?, ?)
        `, [senderChatID, receiverChatID, content, status]);
                console.log("Message saved with ID:", result);
                // Emit the message to the specific receiver
                socket.to(receiverChatID).emit("receive_message", {
                    content,
                    senderChatID,
                    receiverChatID,
                    status,
                });
            }
            catch (error) {
                console.error("Error saving message:", error);
                // Optionally emit an error event back to the sender or log it
            }
            finally {
                // Ensure the connection is released regardless of success or failure
                if (connection) {
                    connection.release();
                }
            }
        }
        else {
            console.error("receiverChatID is not provided.");
        }
    }));
});
// Main route
app.get("/", (req, res) => {
    res.send("Welcome to the server");
});
// Auth routes
app.use("/api/auth", authRoutes_1.default);
// Start the server
server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
exports.default = app;
