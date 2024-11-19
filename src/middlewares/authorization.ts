import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import { sendResponse } from "../utils/responseFormatter";

config();

export interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

const key = process.env.SECRET_KEY;

if (!key) {
  throw new Error("secret key not found");
}

const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(' ')[1];
  console.log(token)

  try {
    const decoded = jwt.verify(token, key);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
    return;
  }
};

export default authenticateToken;
