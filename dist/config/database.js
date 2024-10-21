"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
// MySQL connection configuration
const dbconnection = mysql2_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "my_database",
});
// Connect to the database
dbconnection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.message);
        return;
    }
    console.log("Connected to MySQL!");
});
exports.default = dbconnection;
