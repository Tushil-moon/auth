"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./config/database"));
// Example: Querying the 'users' table
database_1.default.query('SELECT * FROM users', (err, results) => {
    if (err) {
        console.error('Error executing query:', err.message);
        return;
    }
    console.log('User data:', results);
});
// Close the connection
database_1.default.end((err) => {
    if (err)
        console.error('Error closing connection:', err.message);
});
