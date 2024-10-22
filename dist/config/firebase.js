"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.fireapp = void 0;
const app_1 = require("firebase-admin/app");
const config = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};
exports.fireapp = (0, app_1.initializeApp)({
    credential: (0, app_1.cert)(config),
    projectId: config.projectId,
});
