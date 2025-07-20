import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp({
  credential: cert({
    projectId: process.env.NEXT_PRIVATE_FIREBASE_PROJECT_ID,
    clientEmail: process.env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY,
  }),
});

export const db = getFirestore(app);
