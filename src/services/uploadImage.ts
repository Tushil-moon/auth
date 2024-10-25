import { initializeApp, cert, AppOptions, getApps } from "firebase-admin/app";
import { ServiceAccount } from "firebase-admin";
import admin from "firebase-admin";
import { Request, Response } from "express";
import { Multer } from "multer";

// Firebase Admin SDK configuration
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'), // Ensure proper format for private key
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
};

const appOptions: AppOptions = {
  credential: cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
};

// Check if the Firebase app has already been initialized
const firebaseApps = getApps();
export const fireapp = firebaseApps.length === 0 ? initializeApp(appOptions) : firebaseApps[0];

const bucket = admin.storage().bucket();

// Function to upload image to Firebase Storage
export function uploadImageToFirebase(profileImage: any): Promise<string> {
  console.log(profileImage)
    const blob = bucket.file(Date.now() + "_" + profileImage.name);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: profileImage.type, 
    },
  });

  return new Promise<string>((resolve, reject) => {
    blobStream.on("finish", (data:any) => {
     console.log(data)
      resolve(data);
    });

    blobStream.on("error", (err) => {
      reject(err);
    });

    blobStream.end(profileImage.buffer);
  });
}
