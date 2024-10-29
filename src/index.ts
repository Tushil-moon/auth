import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import http from "http";
import { Server } from "socket.io";
import { dbconnection } from "./config/database";

const PORT = process.env.PORT || 8801;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "*",
  })
);
const users: any = {}; // Store users with their chatIDs
// Socket.IO logic
io.on("connection", (socket) => {
  // Get the chatID from query parameters and join the corresponding room
  const chatID = socket.handshake.query.chatID as string;
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
  socket.on("send_message", async (message) => {
    const { receiverChatID, senderChatID, content } = message;
    console.log(message);
  
    // Ensure receiverChatID is provided before emitting the message
    if (receiverChatID) {
      let connection; // Declare connection variable
      try {
        connection = await dbconnection.getConnection();
  
        // Insert the message into the database
        const [result] = await connection.query(`
          INSERT INTO messages (senderChatID, receiverChatID, content)
          VALUES (?, ?, ?)
        `, [senderChatID, receiverChatID, content]);
  
        console.log('Message saved with ID:', result);
        
        // Emit the message to the specific receiver
        socket.to(receiverChatID).emit("receive_message", {
          content,
          senderChatID,
          receiverChatID,
        });
      } catch (error) {
        console.error('Error saving message:', error);
        // Optionally emit an error event back to the sender or log it
      } finally {
        // Ensure the connection is released regardless of success or failure
        if (connection) {
          connection.release();
        }
      }
    } else {
      console.error('receiverChatID is not provided.');
    }
  });
  
});

// Main route
app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

export default app;
