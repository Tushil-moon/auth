import { Server, Socket } from "socket.io";
import { sqlDB } from "../config/db.config";
import { noti } from "../utils/userChats";

const users: Record<string, { socketId: string; status: boolean }> = {};
const activeUsers: Record<string, string[]> = {};

export const socketService = (io: Server) =>
  io.on("connection", (socket: Socket) => {
    const chatID = socket.handshake.query.chatID as string;

    if (chatID) {
      socket.join(chatID);
      users[chatID] = { socketId: socket.id, status: true };

      // Emit updated user list
      io.emit("user_list", getUsersList(users));
    }

    socket.on("typing", (data) => {
      socket.to(data.receiverid).emit("receive_type", {
        Id: data.senderid,
        status: data.status,
      });
    });

    socket.on("onlineStatus", (data) => {
      if (users[data.chatId]) {
        users[data.chatId].status = data.status;
        io.emit("user_list", getUsersList(users));
      }
    });

    socket.on("joinChat", ({ chatId, userId }) => {
      if (!activeUsers[chatId]) {
        activeUsers[chatId] = [];
      }

      if (!activeUsers[chatId].includes(userId)) {
        activeUsers[chatId].push(userId);
      }

      console.log(`User ${userId} joined chat ${chatId}`);
    });

    socket.on("send_message", async (message: any) => {
      const { receiverChatID, senderChatID, content, status, time, fcm } = message;
      console.log(fcm)
      if (!receiverChatID) {
        console.error("receiverChatID is not provided.");
        return;
      }

      let connection;
      try {
        connection = await sqlDB.getConnection();

        // Insert message
        const [result] = await connection.query(
          `
          INSERT INTO messages (senderChatID, receiverChatID, content, status, time)
          VALUES (?, ?, ?, ?, ?)
        `,
          [senderChatID, receiverChatID, content, status, time]
        );

        console.log("Message saved with ID:", result);

        // Update message status
        const isReceiverActive = activeUsers[senderChatID]?.includes(receiverChatID);
        const isReceiverOnline = users[receiverChatID]?.status;

        const statusToUpdate = isReceiverActive
          ? "read"
          : isReceiverOnline
          ? "delivered"
          : "sent";

        await connection.execute(
          `
          UPDATE messages
          SET status = ?
          WHERE senderChatID = ? AND receiverChatID = ? AND status = 'sent'
        `,
          [statusToUpdate, senderChatID, receiverChatID]
        );

        // Notify sender and receiver
        io.to(senderChatID).emit("messageStatusUpdated", {
          senderChatID,
          receiverChatID,
          status: statusToUpdate,
        });

        socket.to(receiverChatID).emit("receive_message", {
          content,
          senderChatID,
          receiverChatID,
          status,
          time,
        });
        const notification = {
          title:"New Message",
          body:content
        }

        
        await noti(notification,fcm)
      } catch (error) {
        console.error("Error saving message:", error);
      } finally {
        if (connection) connection.release();
      }
    });

    socket.on("markMessagesRead", async ({ receiverChatID }: any) => {
      if (!receiverChatID) {
        console.error("No receiverChatID provided for marking messages as read.");
        return;
      }

      let connection;
      try {
        connection = await sqlDB.getConnection();

        await connection.query(
          `
          UPDATE messages
          SET status = 'read'
          WHERE receiverChatID = ? AND status = 'sent'
        `,
          [receiverChatID]
        );

        socket.emit("messagesRead", { receiverChatID });
      } catch (error) {
        console.error("Error updating message status to read:", error);
      } finally {
        if (connection) connection.release();
      }
    });

    socket.on("customDisconnect", (id) => {
      const chatID = Object.keys(users).find((key) => key === id.id);
      if (chatID) {
        console.log(`User with chatID: ${chatID} is disconnected.`);
        delete users[chatID];
        io.emit("user_list", getUsersList(users));
      }
    });

    socket.on("disconnect", () => {
      const chatID = Object.keys(users).find(
        (key) => users[key].socketId === socket.id
      );
      if (chatID) {
        console.log(`User with chatID: ${chatID} disconnected.`);
        delete users[chatID];
        io.emit("user_list", getUsersList(users));
      }
    });
  });

function getUsersList(users: Record<string, { socketId: string; status: boolean }>) {
  return Object.entries(users).map(([key, value]) => ({
    chatID: key,
    ...value,
  }));
}
