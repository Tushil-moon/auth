import { config } from "dotenv";
import { sqlDB } from "./db.config";

// Load environment variables
config();

// Validate essential environment variables
const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  throw new Error("DB_URL is not defined in the environment variables");
}

// Utility function to execute table creation or deletion
const executeQuery = async (query: string, description: string) => {
  let connection;
  try {
    connection = await sqlDB.getConnection();
    await connection.query(query);
    console.log(`${description} - SUCCESS`);
  } catch (error) {
    console.error(`${description} - FAILED:`, error);
    throw error; // Optionally rethrow for monitoring or further handling
  } finally {
    if (connection) connection.release();
  }
};

// Create the `users` table
export const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      profileImage VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await executeQuery(query, "Creating Users Table");
};

// Create the `messages` table
export const createMessagesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      senderChatID VARCHAR(255) NOT NULL,
      receiverChatID VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      status ENUM('sent', 'delivered', 'read') DEFAULT 'sent',
      time DATETIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await executeQuery(query, "Creating Messages Table");
};

// Delete a table (example: `messages`)
export const deleteTable = async (tableName: string) => {
  const query = `DROP TABLE IF EXISTS ${tableName}`;
  await executeQuery(query, `Deleting Table ${tableName}`);
};