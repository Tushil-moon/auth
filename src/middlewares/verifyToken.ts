import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import { sendResponse } from "../utils/responseFormatter";

// Load environment variables from .env file
config();
// Store this securely (e.g., environment variable)

export interface CustomRequest extends Request {
  user?: string | JwtPayload; // Extend request to include 'user'
}

const key = process.env.SECRET_KEY;

if (!key) {
  throw new Error("secret key not found");
}

export const verifyToken = (
  req: Request,
  res: Response,
) => {
  const { token } = req.body; // Extract token from request body

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  // Verify the JWT token
  jwt.verify(token, key, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ message: "Invalid token." });
      return;
    }
    sendResponse(res, {
      status: 200,
      message: "user verified",
      data:true
    });
  });
};
