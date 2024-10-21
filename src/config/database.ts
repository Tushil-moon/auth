import mysql from 'mysql2/promise';
import { config } from 'dotenv';

// Load environment variables from .env file
config(); 

// Ensure DB_URL is defined
const dbUrl = process.env.DB_URL;
console.log(dbUrl)

if (!dbUrl) {
  throw new Error('DB_URL is not defined in the environment variables');
}

// Create a MySQL connection pool
export const dbconnection = mysql.createPool(dbUrl);
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
        KEY(email(255))  -- Specify the key length for the email column
      );
    `);
    
    console.log('Users table created or already exists.');
    connection.release();
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};

// Example usage
(async () => {
  await createUsersTable();
})();