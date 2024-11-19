import { dbconnection } from "../config/database";

export const getUserChats = async (userChatID: string) => {
    try {
      const connection = await dbconnection.getConnection();
  
      const query = `
        SELECT 
          CASE 
            WHEN senderChatID = ? THEN receiverChatID
            ELSE senderChatID
          END AS chatPartner,
          MAX(created_at) AS lastMessageTime
        FROM messages
        WHERE senderChatID = ? OR receiverChatID = ?
        GROUP BY chatPartner
        ORDER BY lastMessageTime DESC;
      `;
  
      const [results] = await connection.query(query, [userChatID, userChatID, userChatID]);
      console.log("User chats:", results);
      connection.release();
      return results;
    } catch (error) {
      console.error("Error retrieving user chats:", error);
    }
  };
  
  // Example usage:
  getUserChats("user1");
  