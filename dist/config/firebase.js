"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fireapp = void 0;
const app_1 = require("firebase-admin/app");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
const serviceAccountPath = path_1.default.join(__dirname, "angularchatapp-8b6c5-firebase-adminsdk-1q4f5-adca81438f.json");
console.log(serviceAccountPath);
exports.fireapp = (0, app_1.initializeApp)({
    credential: firebase_admin_1.default.credential.cert(serviceAccountPath),
    projectId: "angularchatapp-8b6c5", // <FIREBASE_PROJECT_ID>
});
