import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";

// Load environment variables from .env file
config();
// Store this securely (e.g., environment variable)

export interface CustomRequest extends Request {
  user?: string | JwtPayload; // Extend request to include 'user'
}
