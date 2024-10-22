import { initializeApp, cert } from "firebase-admin/app";
import { ServiceAccount } from "firebase-admin";

const config: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};
export const fireapp = initializeApp({
  credential: cert(config),
  projectId: config.projectId,
});
