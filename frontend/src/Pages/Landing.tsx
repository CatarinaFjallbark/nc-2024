import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  auth,
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../firebase.ts";
import { MuiTextField } from "../Components/TextField/MuiTextField.tsx";
import { MuiButton } from "../Components/Button/MuiButton.tsx";

// In order to allow calling recaptchaVerifier and confirmationResult on window
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

const Landing = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [errorCode, setErrorCode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
        size: "invisible",
        callback: () => {
          console.log("recaptcha done");
        },
      });
    }
  }, [errorPhone, errorCode]);

  // Reset code error if code is emptied
  useEffect(() => {
    if (!code) {
      setErrorCode(false);
    }
  }, [code]);

  return (
    <>
      <h1>NC 2024</h1>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <MuiTextField
          label="phone number with language code, eg +46"
          variant="outlined"
          value={phoneNumber}
          error={errorPhone}
          helperText={
            errorPhone
              ? "Unfortuantly there was an error signing you in, please try again"
              : ""
          }
          onChange={(e) => {
            // Resets error when phone number is changed
            setErrorPhone(false);
            setShowCodeInput(false);
            setCode("");
            setPhoneNumber(e.target.value);
          }}
        />
        {showCodeInput && (
          <MuiTextField
            label="texted code"
            variant="outlined"
            value={code}
            error={errorCode}
            helperText={
              errorCode
                ? "Unfortuantly there was an error signing you in, please try again"
                : ""
            }
            onChange={(e) => {
              setErrorCode(false);
              setCode(e.target.value);
            }}
          />
        )}
        <MuiButton
          id="sign-in-button"
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
                  setErrorCode(true);
                });
            } else {
              console.log("phone number");
              try {
                signInWithPhoneNumber(
                  auth,
                  phoneNumber,
                  window.recaptchaVerifier,
                )
                  .then((confirmationResult) => {
                    window.confirmationResult = confirmationResult;
                    console.log("phone number confirmed");
                    setShowCodeInput(true);
                  })
                  .catch((error) => {
                    // Error; SMS not sent
                    console.log("number error", error);
                    setErrorPhone(true);
                  });
              } catch (error) {
                // Error; SMS not sent
                console.log("Test", error);
                setErrorPhone(true);
              }
            }
          }}
        >
          {showCodeInput ? "Send code" : "Sign in"}
        </MuiButton>
      </Box>
    </>
  );
};

export default Landing;
