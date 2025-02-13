import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sqlDB } from "../config/db.config";
import { sendResponse } from "../utils/responseFormatter";
import { getMessaging } from "firebase-admin/messaging";

// Ensure the secret key is available
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("Secret key not found in environment variables.");
}

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name, FCM } = req.body;

  // Input validation
  if (!email || !password || !name) {
    return sendResponse(res, {
      status: 400,
      message: "Name, email, and password are required.",
    });
  }

  const connection = await sqlDB.getConnection();
  try {
    // Check if the email is already registered
    const [existingUser]: any = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return sendResponse(res, {
        status: 400,
        message: "Email is already in use.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [result]: any = await connection.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    // Respond with the newly created user details
    sendResponse(res, {
      status: 201,
      message: "User registered successfully.",
      data: {
        id: result.insertId,
        name,
        email,
      },
    });
  } catch (error: any) {
    console.error("Error during user registration:", error);

    if (error.code === "ER_DUP_ENTRY") {
      sendResponse(res, {
        status: 400,
        message: "Email is already in use.",
      });
    } else {
      sendResponse(res, {
        status: 500,
        message: "An unexpected error occurred during registration.",
      });
    }
  } finally {
    connection.release();
  }
};

// Login a user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    sendResponse(res, {
      status: 400,
      message: "Email and password are required.",
    });
    return;
  }

  const connection = await sqlDB.getConnection();
  try {
    const [rows]: any = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      sendResponse(res, {
        status: 404,
        message: "User not found.",
      });
      return;
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      sendResponse(res, {
        status: 400,
        message: "Invalid email or password.",
      });
      return;
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    sendResponse(res, {
      status: 200,
      message: "Login successful.",
      data: {
        access_token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
        },
      },
    });
  } catch (error) {
    sendResponse(res, {
      status: 500,
      message: "Login failed.",
    });
  } finally {
    connection.release();
  }
};

export const sendNotification = async (req: Request, res: Response) => {
  const { notification, to } = req.body;

  if (!notification || !to) {
    sendResponse(res, {
      status: 400,
      message: "Notification and recipient token are required.",
    });
    return;
  }

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

  try {
    const response = await getMessaging().send(message);
    console.log(response)
    sendResponse(res, {
      status: 200,
      message: "Notification sent successfully.",
      data: response,
    });
  } catch (error: any) {
    console.log(error)
    sendResponse(res, {
      status: 500,
      message: "Failed to send notification.",
    });
  }
};
