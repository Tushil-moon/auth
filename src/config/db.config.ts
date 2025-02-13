import mysql from "mysql2/promise";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// Ensure DB_URL is defined
const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  throw new Error("DB_URL is not defined in the environment variables");
}

// Create a MySQL connection pool
export const sqlDB = mysql.createPool({
  host: "localhost",
  password: "12345",
  user: "root",
  database: "web_chat",
});
