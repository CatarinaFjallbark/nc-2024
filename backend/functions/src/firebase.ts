import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export { onCall, HttpsError } from "firebase-functions/v2/https";
export * as logger from "firebase-functions/logger";

initializeApp();

export const db = getFirestore();
