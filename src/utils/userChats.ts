import { RowDataPacket } from "mysql2";
// import { dbconnection } from "../config/database";
import { sqlDB } from "../config/db.config";
import { getMessaging } from "firebase-admin/messaging";

// import { dbconnection } from "../config/database";

export const getUserChats = async (userChatID: string) => {
  try {
    const connection = await sqlDB.getConnection();

    const query = `
        (
        SELECT
            CASE
                WHEN messages.senderChatID = ? THEN messages.receiverChatID
                ELSE messages.senderChatID
            END AS chatPartnerID,
            MAX(messages.created_at) AS lastMessageTime,
            users.id AS userID,
            users.name AS userName,
            users.email AS userEmail,
            users.profileImage AS userProfileImage
        FROM messages
        INNER JOIN users
            ON users.email = (
                CASE
                    WHEN messages.senderChatID = ? THEN messages.receiverChatID
                    ELSE messages.senderChatID
                END
            )
        WHERE messages.senderChatID = ? OR messages.receiverChatID = ?
        GROUP BY chatPartnerID, users.id, users.name, users.email, users.profileImage
        ORDER BY lastMessageTime DESC
    );

`;


    const [results] = await connection.query(query, [
      userChatID,
      userChatID,
      userChatID,
      userChatID
    ]);
    // console.log("User chats:", results);
    connection.release();
    return results;
  } catch (error) {
    console.error("Error retrieving user chats:", error);
  }
};

export const findUser = async (email: any) => {
  let connection;
  try {
    // Get a connection from the pool
    connection = await sqlDB.getConnection();

    // Query to find the user by email
    const query = `SELECT * FROM users WHERE email = ?`;

    // Execute the query
    const [results] = await connection.query<RowDataPacket[]>(query, [email]);

    // Log the first result (if any)
    // console.log("User:", results[0]);

    // Return the results
    return results;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error; // Re-throw the error to handle it at a higher level
  } finally {
    // Ensure the connection is released back to the pool
    if (connection) {
      connection.release();
    }
  }
};

export const noti = async (notification:any,to:any) =>{
  console.log(to)
  const message = {
    notification: {
      title: notification.title,
      body: notification.body,
    },
    webpush: {
      notification: {
        icon: notification.icon,
      },
    },
    token: to,
  };

  const ok = await getMessaging().send(message);
  return ok;
}

// Example usage:
// getUserChats("user1");
// findUser("user@gmail.com")
