import { Server, Socket } from "socket.io";
import { dbconnection } from "../config/database";

// Store users with their chatIDs
const users: any = {};

// Socket.IO logic
export const socketService = (io: Server) =>
  io.on("connection", (socket: Socket) => {
    // io.emit('connect','hello')
    // Get the chatID from query parameters and join the corresponding room
    const chatID = socket.handshake.query.chatID as string;
    console.log(chatID);
    if (chatID) {
      socket.join(chatID);
      users[chatID] = { socketId: socket.id, status: true }; // Add user to the list
      console.log(users);
      const userList = Object.entries(users).map(([key, value]) => ({
        chatID: key,
        ...(value as Object),
      }));
      // Emit the updated user list to all connected users
      io.emit("user_list", userList);
    }

    socket.on("typing", (data) => {
      console.log("typing..", data);
      socket.to(data.chatId).emit("receive_type", data.status);
    });

    socket.on("onlineStatus", (data) => {
      console.log(
        `User ${data.chatId} is now ${data.status ? "online" : "offline"}`
      );
      // Update the user's status in the `users` object
      if (users[data.chatId]) {
        users[data.chatId].status = data.status;
      }
      // Broadcast the status to all users
      const userList = Object.entries(users).map(([key, value]) => ({
        chatID: key,
        ...(value as Object),
      }));
      // Emit the updated user list to all connected users
      io.emit("user_list", userList);
    });

    // Send message to a specific user in a room
    socket.on("send_message", async (message: any) => {
      const { receiverChatID, senderChatID, content, status } = message;
      console.log(message);

      // Ensure receiverChatID is provided before emitting the message
      if (receiverChatID) {
        let connection; // Declare connection variable
        try {
          connection = await dbconnection.getConnection();

          // Insert the message into the database
          const [result] = await connection.query(
            `
          INSERT INTO messages (senderChatID, receiverChatID, content, status)
          VALUES (?, ?, ?, ?)
        `,
            [senderChatID, receiverChatID, content, status]
          );

          console.log("Message saved with ID:", result);

          // Emit the message to the specific receiver
          socket.to(receiverChatID).emit("receive_message", {
            content,
            senderChatID,
            receiverChatID,
            status,
          });
        } catch (error) {
          console.error("Error saving message:", error);
          // Optionally emit an error event back to the sender or log it
        } finally {
          // Ensure the connection is released regardless of success or failure
          if (connection) {
            connection.release();
          }
        }
      } else {
        console.error("receiverChatID is not provided.");
      }
    });
    socket.on("markMessagesRead", async ({ receiverChatID }: any) => {
      if (!receiverChatID) {
        console.error(
          "No receiverChatID provided for marking messages as read."
        );
        return;
      }

      let connection;
      try {
        connection = await dbconnection.getConnection();

        // Update the message status to "read" for messages with this receiverChatID
        const [result] = await connection.query(
          `
        UPDATE messages 
        SET status = 'read' 
        WHERE receiverChatID = ? AND status = 'sent'
      `,
          [receiverChatID]
        );

        console.log(
          `Updated ${result} messages to "read" status for receiverChatID: ${receiverChatID}`
        );

        // Optionally, emit an event to notify the client of the status change
        socket.emit("messagesRead", { receiverChatID });
      } catch (error) {
        console.error("Error updating message status to read:", error);
      } finally {
        if (connection) {
          connection.release();
        }
      }
    });
    // Leave the room when the user disconnects
    socket.on("customDisconnect", (id) => {
      console.log(users);
      // Find the user with the given socketId
      const chatID = Object.keys(users).find((key) => key === id.id);

      if (chatID) {
        console.log(`User with chatID: ${chatID} is disconnected.`);

        // Remove the user from the users object
        delete users[chatID];
        // socket.leave(users[chatID].socketId)

        console.log("Updated users list:", users);
      } else {
        console.log(`No user found with socketId: ${id.id}`);
      }
    });
  });
