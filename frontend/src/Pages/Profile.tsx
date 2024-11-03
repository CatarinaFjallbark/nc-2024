import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { emailRegex, nameRegex } from "../Helpers/Regex";
import { setData, auth, getData } from "../../firebase.ts";
import { MuiTextField } from "../Components/TextField/MuiTextField.tsx";
import { MuiButton } from "../Components/Button/MuiButton.tsx";

type ProfileData = { data: { name: string; email: string } };

enum SaveResult {
  INITIAL = "initial",
  PENDING = "pending",
  SUCCESS = "success",
  FAIL = "fail",
}

const Profile = () => {
  const { phonenumber } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [saveResult, setSaveResult] = useState<SaveResult>(SaveResult.INITIAL);
  const navigate = useNavigate();

  const validate = (
    toValidate: { value: string; regex: RegExp; errorType: "name" | "email" }[],
  ) => {
    toValidate.forEach(({ value, regex, errorType }) => {
      if (!regex.test(value)) {
        if (errorType === "name") {
          setErrorName(true);
        } else if (errorType === "email") {
          setErrorEmail(true);
        }
      }
    });
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("Signed in");
        if (!loaded) {
          try {
            const { data } = (await getData(phonenumber)) as ProfileData;
            if (data) {
              setName(data.name);
              setEmail(data.email);
              console.log("Get data", data);
            }
          } catch {
            console.log("New user, no previous successful logins");
          }
        }
        setLoaded(true);
      } else {
        // User is signed out
        navigate("/");
        console.log("Signed out");
      }
    });
  });

  return (
    loaded && (
      <>
        <MuiButton
          sx={{ display: "flex" }}
          onClick={() => {
            // Use Firebase function
            console.log("Sign out", name, email, phonenumber);
            auth.signOut();
          }}
        >
          Sign out
        </MuiButton>
        <h1>Profile page</h1>
        <p>{phonenumber}</p>
        <Box sx={{ display: "flex", flexDirection: "column", margin: "1rem" }}>
          <MuiTextField
            label="first and last name"
            variant="outlined"
            value={name}
            error={errorName && saveResult !== SaveResult.INITIAL}
            helperText={
              errorName && saveResult !== SaveResult.INITIAL
                ? "Name field cannot be empty"
                : ""
            }
            onChange={(e) => {
              setErrorName(false);
              setName(e.target.value);
              validate([
                { value: e.target.value, regex: nameRegex, errorType: "name" },
              ]);
            }}
          />
          <MuiTextField
            autoFocus
            label="email address"
            variant="outlined"
            value={email}
            error={errorEmail && saveResult !== SaveResult.INITIAL}
            helperText={
              errorEmail && saveResult !== SaveResult.INITIAL
                ? "Incorrect email address"
                : ""
            }
            onChange={(e) => {
              setErrorEmail(false);
              setEmail(e.target.value);
              validate([
                {
                  value: e.target.value,
                  regex: emailRegex,
                  errorType: "email",
                },
              ]);
            }}
          />
          <MuiButton
            onClick={() => {
              setSaveResult(SaveResult.PENDING);
              validate([
                { value: name, regex: nameRegex, errorType: "name" },
                { value: email, regex: emailRegex, errorType: "email" },
              ]);
              console.log("Save", name, email);
              console.log("Error", errorName, errorEmail);
              if (errorName || errorEmail) {
                console.log("errors found on save");
                setSaveResult(SaveResult.FAIL);
              } else {
                console.log("set data with api", {
                  phonenumber,
                  name,
                  email,
                });
                setData({
                  phonenumber,
                  data: {
                    name,
                    email,
                  },
                })
                  .then(() => {
                    setSaveResult(SaveResult.SUCCESS);
                  })
                  .catch((error) => {
                    console.log("failed to save", error);
                    setSaveResult(SaveResult.FAIL);
                  });
              }
            }}
          >
            Save
          </MuiButton>
          {saveResult === SaveResult.FAIL ? (
            <p>Unfortuantly there was an error saving, please try again</p>
          ) : (
            saveResult === SaveResult.SUCCESS && <p>Your details are saved</p>
          )}
        </Box>
      </>
    )
  );
};

export default Profile;
