import { applicationDefault, initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";
import path from "path";

const serviceAccountPath = path.join(
  __dirname,
  "angularchatapp-8b6c5-firebase-adminsdk-1q4f5-adca81438f.json"
);
console.log(serviceAccountPath);

export const fireapp = initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  projectId: "angularchatapp-8b6c5", // <FIREBASE_PROJECT_ID>
});
 