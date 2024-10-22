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
exports.sendNotification = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const responseFormatter_1 = require("../utils/responseFormatter");
const userFormat_1 = require("../utils/userFormat");
const dotenv_1 = require("dotenv");
const messaging_1 = require("firebase-admin/messaging");
// Load environment variables from .env file
(0, dotenv_1.config)();
const key = process.env.SECRET_KEY;
if (!key) {
    throw new Error("secret key not found");
}
// Register a new user
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    if (!email) {
        (0, responseFormatter_1.sendResponse)(res, {
            status: 400,
            message: "email is required",
        });
        return;
    }
    if (!name) {
        (0, responseFormatter_1.sendResponse)(res, {
            status: 400,
            message: "name is required",
        });
        return;
    }
    if (!password) {
        (0, responseFormatter_1.sendResponse)(res, {
            status: 400,
            message: "password is required",
        });
        return;
    }
    const connection = yield database_1.dbconnection.getConnection();
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield connection.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);
        (0, responseFormatter_1.sendResponse)(res, {
            status: 201,
            message: "User registered successfully!",
        });
    }
    catch (error) {
        console.error(error);
        (0, responseFormatter_1.sendResponse)(res, {
            status: 500,
            message: "Registration failed!",
        });
    }
    finally {
        connection.release();
    }
});
exports.register = register;
// Login a user
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const connection = yield database_1.dbconnection.getConnection();
    try {
        const [rows] = yield connection.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            (0, responseFormatter_1.sendResponse)(res, {
                status: 404,
                message: "User not found!",
            });
            return;
        }
        const user = rows[0];
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            (0, responseFormatter_1.sendResponse)(res, {
                status: 400,
                message: "Invalid email or password",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, key, {
            expiresIn: "1h",
        });
        (0, responseFormatter_1.sendResponse)(res, {
            status: 200,
            message: "Login successful",
            data: {
                token,
                user: (0, userFormat_1.formatUserResponse)(user),
            },
        });
    }
    catch (error) {
        (0, responseFormatter_1.sendResponse)(res, {
            status: 500,
            message: "Login failed",
        });
    }
    finally {
        connection.release();
        console.log("connection release!");
    }
});
exports.login = login;
const sendNotification = (req, res) => {
    const data = req.body; // Fcm token received by front end application
    console.log(data);
    if (!data) {
        (0, responseFormatter_1.sendResponse)(res, {
            status: 400,
            message: "provide correct data",
        });
    }
    const message = {
        notification: {
            title: data.notification.title,
            body: data.notification.body,
        },
        webpush: {
            notification: {
                icon: data.notification.icon, // Set the icon for web notifications
            },
        },
        token: data.to, // FCM token from client-side
    };
    (0, messaging_1.getMessaging)()
        .send(message)
        .then((response) => {
        console.log("Notification Sent");
        (0, responseFormatter_1.sendResponse)(res, {
            status: 200,
            message: "notification sent",
            data: "",
        });
    })
        .catch((error) => {
        console.log("Error sending message:", error);
    });
};
exports.sendNotification = sendNotification;
