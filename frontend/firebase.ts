import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZK_PZj41KDDdfqVlwUy81CXacsQJlB7M",
  authDomain: "nc-2024-614d0.firebaseapp.com",
  projectId: "nc-2024-614d0",
  storageBucket: "nc-2024-614d0.appspot.com",
  messagingSenderId: "123260443755",
  appId: "1:123260443755:web:acdfef2af07c5c074b252e"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(firebaseApp);
auth.useDeviceLanguage();
export { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
export type { ConfirmationResult } from 'firebase/auth';

