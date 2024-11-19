import { Request, Response } from "express";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import config from "../config/firebase";
import { sendResponse } from "../utils/responseFormatter";
import { dbconnection } from "../config/database";
import { userInfo } from "os";
import { getUserChats } from "../utils/userChats";

// Initialize Firebase app
initializeApp(config.firebaseConfig);
const storage = getStorage();

// Define a CustomRequest interface extending the Express Request
export interface CustomRequest extends Request {
  file: Express.Multer.File; // Assuming file will always be present
  userId: string; // Use the appropriate type for userId
}

// Placeholder for a user function; implement as needed
export const user = async (req: any, res: Response) => {};

export const uploadProfilePic = async (
  req: any, // Use CustomRequest to access file and userId
  res: Response
): Promise<void> => {
  //   console.log(req);

  // Get a connection to the database
  const connection = await dbconnection.getConnection();

  try {
    if (!req.file) {
      return sendResponse(res, {
        status: 400,
        message: "No file uploaded",
      });
    }

    const dateTime = Date.now();
    const storageRef = ref(
      storage,
      `files/${req.file.originalname} ${dateTime}`
    );
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file to Firebase Storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("File uploaded!");

    // Get user ID from request
    const userId = req.body.id; // Ensure userId is set before reaching this point

    // Update the user's profile picture URL in the database
    const data = await connection.execute(
      "UPDATE users SET profileImage = ? WHERE id = ?",
      [downloadURL, userId]
    );
    const [updatedUser] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    return sendResponse(res, {
      status: 200,
      message: "File uploaded successfully!",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Error uploading file:", error); // Log the error for debugging
    return sendResponse(res, {
      status: 400,
      message: error.message || "An error occurred while uploading.",
    });
  } finally {
    // Always release the database connection
    await connection.release();
  }
};

export const getMessage = async (req: Request, res: Response) => {
  const { senderChatID, receiverChatID } = req.body;
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
    connection = await dbconnection.getConnection();

    // Query to fetch messages between sender and receiver
    const [messages] = await connection.query(
      `
      SELECT * FROM messages 
      WHERE (senderChatID = ? AND receiverChatID = ?) 
         OR (senderChatID = ? AND receiverChatID = ?)
      ORDER BY created_at ASC
    `,
      [senderChatID, receiverChatID, receiverChatID, senderChatID]
    );

    return sendResponse(res, {
      status: 200,
      message: "Message fetch successfully",
      data: {
        messages,
      },
    }); // Return the list of messages
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
  console.log(req.body)
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
