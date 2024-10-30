import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import Profile from "./Pages/Profile.tsx";
import Landing from "./Pages/Landing";

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
const auth = getAuth(firebaseApp);
auth.useDeviceLanguage();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Landing firebaseAuth={auth} />,
      },
      {
        path: "/:phonenumber",
        element: <Profile />,
      },
    ],
  },
]);


createRoot(document.getElementById("root")!).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
);
