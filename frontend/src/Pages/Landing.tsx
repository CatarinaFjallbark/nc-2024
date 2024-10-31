import { useState, useEffect } from "react";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  auth,
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../firebase.ts";
import { TextField } from "../Components/TextField/TextField.tsx";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

type LandingError = {
  phone: boolean;
  code: boolean;
};

const Landing = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [error, setError] = useState<LandingError>({
    phone: false,
    code: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
      size: "invisible",
      callback: () => {
        console.log("recaptcha done");
      },
    });
  }, [error.phone, error.code]);

  // Reset code error if code is emptied
  useEffect(() => {
    if (!code) {
      setError({ ...error, code: false });
    }
  }, [error, code]);

  return (
    <>
      <h1>NC 2024</h1>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          label="phone number with language code, eg +46"
          variant="outlined"
          value={phoneNumber}
          error={error.phone}
          helperText={
            error.phone
              ? "Unfortuantly there was an error signing you in, please try again"
              : ""
          }
          onChange={(e) => {
            // Resets error when phone number is changed
            setError({ ...error, phone: false });
            setShowCodeInput(false);
            setCode("");
            setPhoneNumber(e.target.value);
          }}
        />
        {showCodeInput && (
          <TextField
            label="texted code"
            variant="outlined"
            value={code}
            error={error.code}
            helperText={
              error.code
                ? "Unfortuantly there was an error signing you in, please try again"
                : ""
            }
            onChange={(e) => {
              setError({ ...error, code: false });
              setCode(e.target.value);
            }}
          />
        )}
        <Button
          id="sign-in-button"
          variant="contained"
          onClick={() => {
            console.log("sign in", phoneNumber);
            if (code) {
              console.log("code");
              window.confirmationResult
                .confirm(code)
                .then(() => {
                  //redirect
                  console.log("confirmed code, redirect to ", phoneNumber);
                  navigate(phoneNumber);
                })
                .catch((error) => {
                  console.log("confirmed code failed", error);
                  setError({ ...error, code: true });
                });
            } else {
              console.log("phone number");
              signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
                .then((confirmationResult) => {
                  window.confirmationResult = confirmationResult;
                  console.log("phone number confirmed");
                  setShowCodeInput(true);
                })
                .catch((error) => {
                  // Error; SMS not sent
                  console.log("number error", error);
                  setError({ ...error, phone: true });
                });
            }
          }}
        >
          {showCodeInput ? "Send code" : "Sign in"}
        </Button>
      </Box>
    </>
  );
};

export default Landing;
