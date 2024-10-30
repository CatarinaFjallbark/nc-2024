import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import {
  Auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

const Landing = ({ firebaseAuth }: { firebaseAuth: Auth }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [erroPhone, setErrorPhone] = useState(false);
  const [errorCode, setErrorCode] = useState(false);

  const onSignInSubmit = () => {
    console.log("onSignInSubmit");
  };
  

  window.recaptchaVerifier = new RecaptchaVerifier(
    firebaseAuth,
    "sign-in-button",
    {
      size: "invisible",
      callback: () => {
        onSignInSubmit()
      }
    },
  );

  return (
    <Box>
      <h1>NC 2024</h1>
      <Box sx={{ display: "flex", flexDirection: "column", margin: "1rem" }}>
        <TextField
          sx={{ margin: "1rem" }}
          label="phone number"
          variant="outlined"
          value={phoneNumber}
          error={erroPhone}
          helperText={
            erroPhone
              ? "Unfortuantly there was an error signing you in, please try again"
              : ""
          }
          onChange={(e) => {
            setErrorPhone(false);
            setPhoneNumber(e.target.value);
          }}
        />
        {code && (
          <TextField
            sx={{ margin: "1rem" }}
            label="texted code"
            variant="outlined"
            value={phoneNumber}
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
            // Use Firebase auth
            console.log("sign in", phoneNumber);
            if (code) {
              console.log("code");
              window.confirmationResult.confirm(code).catch((error) => {
                // Error; code
                console.error(error);
                setErrorCode(true);
              });
            } else {
              signInWithPhoneNumber(
                firebaseAuth,
                phoneNumber,
                window.recaptchaVerifier,
              )
                .then((confirmationResult) => {
                  // SMS sent. Prompt user to type the code from the message, then sign the
                  // user in with confirmationResult.confirm(code).
                  window.confirmationResult = confirmationResult;
                  // ...
                })
                .catch((error) => {
                  // Error; SMS not sent
                  console.error(error);
                  setErrorPhone(true);
                });
            }
          }}
        >
          {code ? "Send code" : "Sign in"}
        </Button>
      </Box>
    </Box>
  );
};

export default Landing;
