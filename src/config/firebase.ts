import { applicationDefault, initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";
const config = require('./angularchatapp-8b6c5-firebase-adminsdk-1q4f5-adca81438f.json');

export const fireapp = initializeApp({
  credential: admin.credential.cert(config),
  projectId: "angularchatapp-8b6c5", // <FIREBASE_PROJECT_ID>
});
  