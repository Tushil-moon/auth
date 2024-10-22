"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const messaging_1 = require("firebase-admin/messaging");
const responseFormatter_1 = require("../utils/responseFormatter");
// Function to send notifications
const sendNotification = (req, res) => {
    const data = req.body; // Fcm token received by front end application
    console.log(data);
    if (!data) {
        (0, responseFormatter_1.sendResponse)(res, {
            status: 400,
            message: "provide correct data",
            data: ''
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
    (0, messaging_1.getMessaging)().send(message).then((response) => {
        console.log("Notification Sent");
        (0, responseFormatter_1.sendResponse)(res, {
            status: 200,
            message: 'notification sent',
            data: ''
        });
    }).catch((error) => {
        console.log("Error sending message:", error);
    });
};
exports.sendNotification = sendNotification;
