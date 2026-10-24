import { applicationDefault, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
const projectId =
  process.env.NEXT_PUBLIC_PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "Set FIREBASE_PROJECT_ID or NEXT_PUBLIC_PROJECT_ID for Firebase Admin",
  );
}

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        projectId,
        credential: serviceAccount
          ? cert(JSON.parse(serviceAccount))
          : applicationDefault(),
      });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
