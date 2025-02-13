import { Request, Response } from "express";
import { sendResponse } from "../utils/responseFormatter";
import { findUser, getUserChats } from "../utils/userChats";
import { sqlDB } from "../config/db.config";
import { formatUserResponse } from "../utils/userFormat";

// Define a CustomRequest interface extending the Express Request
export interface CustomRequest extends Request {
  file: Express.Multer.File;
}

export const uploadProfilePic = async (req: Request, res: Response) => {
  let connection;
  try {
    connection = await sqlDB.getConnection();

    const customReq = req as CustomRequest;
    const { file } = customReq;
    console.log(file);
    const id = customReq.query.id;

    const { buffer } = file;
    // Convert buffer to Base64 string
    const base64String = buffer.toString("base64");
    // console.log(base64String)
    // Optionally, prefix the string with the data URL scheme for direct usage in HTML
    const mimeType = file.mimetype; // e.g., 'image/jpeg'
    const dataUrl = `data:${mimeType};base64,${base64String}`;
    // Update profile image in the database
    const updateQuery = "UPDATE users SET profileImage = ? WHERE id = ?";
    await connection.query(updateQuery, [dataUrl, id]);

    // Retrieve updated user data
    const [result]: any = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    // Ensure a single result is returned
    const updatedUser = result.length ? result[0] : null;

    if (!updatedUser) {
      return sendResponse(res, {
        status: 404,
        message: "User not found.",
      });
    }

    return sendResponse(res, {
      status: 200,
      message: "File uploaded successfully!",
      data: formatUserResponse([updatedUser]),
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return sendResponse(res, {
      status: 500,
      message: error.message || "An error occurred while uploading.",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const getMessage = async (req: Request, res: Response) => {
  const { senderChatID, receiverChatID } = req.body;
  const limit = parseInt(req.query.limit as string) || 100; // Default to 100 messages if not provided
  const offset = parseInt(req.query.offset as string) || 0; // Default to 0 for the first batch

  if (!senderChatID) {
    sendResponse(res, {
      status: 400,
      message: "senderChatID is required",
    });
    return;
  }

  if (!receiverChatID) {
    sendResponse(res, {
      status: 400,
      message: "receiverChatID is required",
    });
    return;
  }

  let connection;
  try {
    connection = await sqlDB.getConnection();

    // Query to fetch paginated messages between sender and receiver
    const [messages] = await connection.query(
      `
      SELECT * FROM messages 
      WHERE (senderChatID = ? AND receiverChatID = ?) 
         OR (senderChatID = ? AND receiverChatID = ?)
      ORDER BY created_at DESC
    `,
      [
        senderChatID,
        receiverChatID,
        receiverChatID,
        senderChatID,
        limit,
        offset,
      ]
    );

    return sendResponse(res, {
      status: 200,
      message: "Message fetch successfully",
      data: {
        messages,
      },
    }); // Return the paginated list of messages
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error; // Rethrow error to handle it outside
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.body;
  console.log(req.body);
  if (!userId) {
    sendResponse(res, {
      status: 400,
      message: "userId is required",
    });
    return;
  }

  try {
    const result = await getUserChats(userId);
    if (result) {
      return sendResponse(res, {
        status: 200,
        message: "Users fetch successfully",
        data: result,
      }); // Return the list of users
    } else {
      return sendResponse(res, {
        status: 400,
        message: "Users not found",
      });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Rethrow error to handle it outside
  }
};

export const findUserById = async (req: Request, res: Response) => {
  const email = req.query.email;
  console.log(req.body);
  if (!email) {
    sendResponse(res, {
      status: 400,
      message: "email is required",
    });
    return;
  }

  try {
    const result = await findUser(email);

    if (result.length === 0) {
      return sendResponse(res, {
        status: 404,
        message: "User not found!",
      });
    }

    sendResponse(res, {
      status: 200,
      message: "User found!",
      data: [formatUserResponse(result)],
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Rethrow error to handle it outside
  }
};

export const deleteMsgById = async (req: Request, res: Response) => {
  let connection;
  try {
    connection = await sqlDB.getConnection();
    console.log(req.query);
    const { id } = req.query;
    if (!id) {
      sendResponse(res, {
        status: 400,
        message: "id is required",
      });
      return;
    }

    const query = `
    DELETE FROM messages
    WHERE id = ? 
    `;
    await connection.query(query, id);

    sendResponse(res, {
      status: 200,
      message: "Message deleted",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Rethrow error to handle it outside
  }
};

export const getUserNewChats = async (req: Request, res: Response) => {
  let connection;
  try {
    const { senderId, receiverId, offset } = req.body;
    connection = await sqlDB.getConnection();
    
    if (!senderId || !receiverId) {
      sendResponse(res, { status: 400, message: "Id is required" });
      return;
    }

    console.log("Offset:", offset);

    const query = `
      SELECT * FROM (
          SELECT * FROM messages 
          WHERE (senderChatID = ? AND receiverChatID = ?) 
             OR (senderChatID = ? AND receiverChatID = ?)
          ORDER BY created_at DESC
          LIMIT 25 OFFSET ?
      ) AS subquery
      ORDER BY created_at ASC;
    `;

    const [rows] = await connection.execute(query, [
      senderId, receiverId, receiverId, senderId, offset
    ]);

    sendResponse(res, {
      status: 200,
      message: "Fetched",
      data: { messages: rows },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    sendResponse(res, { status: 500, message: "Server error" });
  } finally {
    if (connection) connection.release(); // Ensure connection is released
  }
};

