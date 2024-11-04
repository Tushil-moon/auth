"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.dbconnection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = require("dotenv");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return dotenv_1.config; } });
// Load environment variables from .env file
(0, dotenv_1.config)();
// Ensure DB_URL is defined
const dbUrl = process.env.DB_URL;
console.log(dbUrl);
if (!dbUrl) {
    throw new Error("DB_URL is not defined in the environment variables");
}
// Create a MySQL connection pool
exports.dbconnection = promise_1.default.createPool(dbUrl);
const createUsersTable = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield exports.dbconnection.getConnection();
        // Create the users table
        yield connection.query(`
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
    }
    catch (error) {
        console.error("Error creating users table:", error);
    }
});
const createMessagesTable = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield exports.dbconnection.getConnection();
        // Create the messages table
        yield connection.query(`
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
    }
    catch (error) {
        console.error('Error creating messages table:', error);
    }
});
// Example usage
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield createUsersTable();
    yield createMessagesTable();
}))();
