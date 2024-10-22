import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbconnection } from "../config/database";
import { sendResponse } from "../utils/responseFormatter";
import { formatUserResponse } from "../utils/userFormat";
import { config } from "dotenv";
// import { sendNotification } from "../../../ngrx-auth/notification";

// Load environment variables from .env file
config();

const key = process.env.SECRET_KEY;

if (!key) {
  throw new Error("secret key not found");
}

// Register a new user
export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email) {
    sendResponse(res, {
      status: 400,
      message: "email is required",
    });
    return;
  }
  if (!name) {
    sendResponse(res, {
      status: 400,
      message: "name is required",
    });
    return;
  }
  if (!password) {
    sendResponse(res, {
      status: 400,
      message: "password is required",
    });
    return;
  }
  const connection = await dbconnection.getConnection();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    sendResponse(res, {
      status: 201,
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, {
      status: 500,
      message: "Registration failed!",
    });
  } finally {
    connection.release();
  }
};

// Login a user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const connection = await dbconnection.getConnection();
  try {
    const [rows]: any = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      sendResponse(res, {
        status: 404,
        message: "User not found!",
      });
      return;
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      sendResponse(res, {
        status: 400,
        message: "Invalid email or password",
      });
      return;
    }

    const token = jwt.sign({ userId: user.id }, key, {
      expiresIn: "1h",
    });

    sendResponse(res, {
      status: 200,
      message: "Login successful",
      data: {
        token,
        user: formatUserResponse(user),
      },
    });
  } catch (error) {
    sendResponse(res, {
      status: 500,
      message: "Login failed",
    });
  } finally {
    connection.release();
    console.log("connection release!");
  }
};
