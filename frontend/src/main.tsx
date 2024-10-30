import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Landing from "./Pages/Landing.tsx";
import Profile from "./Pages/Profile.tsx";
import { auth } from "../firebase.ts"

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
