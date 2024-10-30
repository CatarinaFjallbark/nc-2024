import { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import {
  Auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

const Landing = ({ firebaseAuth }: { firebaseAuth: Auth }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [errorCode, setErrorCode] = useState(false);
  const navigate = useNavigate();

  const onSignInSubmit = () => {
    console.log("onSignInSubmit");
  };

  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      firebaseAuth,
      "sign-in-button",
      {
        size: "invisible",
        callback: () => {
          console.log("recaptcha done");
          onSignInSubmit();
        },
      },
    );
  }, [errorPhone, errorCode, firebaseAuth]);

  useEffect(() => {
    if (!code) {
      setErrorCode(false);
    }
  }, [code]);

  return (
    <Box>
      <h1>NC 2024</h1>
      <Box sx={{ display: "flex", flexDirection: "column", margin: "1rem" }}>
        <TextField
          sx={{ margin: "1rem" }}
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
            setErrorPhone(false);
            setPhoneNumber(e.target.value);
            setShowCodeInput(false);
            setCode("");
          }}
        />
        {showCodeInput && (
          <TextField
            sx={{ margin: "1rem" }}
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
                  setErrorCode(true);
                });
            } else {
              console.log("phone number");
              signInWithPhoneNumber(
                firebaseAuth,
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
            }
          }}
        >
          {showCodeInput ? "Send code" : "Sign in"}
        </Button>
      </Box>
    </Box>
  );
};

export default Landing;
