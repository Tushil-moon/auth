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
export const dbconnection = mysql.createPool({
  uri:dbUrl,
  enableKeepAlive: true
});
const createUsersTable = async () => {
  try {
    const connection = await dbconnection.getConnection();

    // Create the users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        KEY(email(255)),
        profileImage VARCHAR(255)
      );
    `);
    console.log("Users table created or already exists.");
    connection.release();
  } catch (error) {
    console.error("Error creating users table:", error);
  }
};
const createMessagesTable = async () => {
  try {
    const connection = await dbconnection.getConnection();
    
    // Create the messages table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        senderChatID VARCHAR(255) NOT NULL,
        receiverChatID VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);   
    
    console.log('Messages table created or already exists.');
    connection.release();
  } catch (error) {
    console.error('Error creating messages table:', error);
  }
};

// Example usage
(async () => {
  await createUsersTable();
  await createMessagesTable();
})();

export { config };
