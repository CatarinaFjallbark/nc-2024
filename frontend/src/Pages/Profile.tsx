import { useNavigate, useParams } from "react-router-dom";
import { Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { emailRegex, nameRegex } from "../Helpers/Regex";
import { setData, auth, getData } from "../../firebase.ts";
import { TextField } from "../Components/TextField/TextField.tsx";

type ProfileError = {
  email: boolean;
  name: boolean;
  general: boolean;
};

type ProfileData = { data: { name: string; email: string } };

enum SaveResult {
  UNKNOWN = "unknown",
  PENDING = "pending",
  SUCCESS = "success",
  FAIL = "fail",
}

const Profile = () => {
  const { phonenumber } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<ProfileError>({
    email: false,
    name: false,
    general: false,
  });
  const [saveResult, setSaveResult] = useState<SaveResult>(SaveResult.UNKNOWN);
  const navigate = useNavigate();

  const validate = (value: string, regex: RegExp, key: keyof ProfileError) => {
    // Only set error after user has tried to save
    if (saveResult !== SaveResult.UNKNOWN && !regex.test(value)) {
      console.log("sets error for", value, key);
      setError({ ...error, [key]: true });
    }
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
        <Button
          sx={{ display: "flex" }}
          variant="contained"
          onClick={() => {
            // Use Firebase function
            console.log("Sign out", name, email, phonenumber);
            auth.signOut();
          }}
        >
          Sign out
        </Button>
        <h1>Profile page</h1>
        <div>{phonenumber}</div>
        <Box sx={{ display: "flex", flexDirection: "column", margin: "1rem" }}>
          <TextField
            label="first and last name"
            variant="outlined"
            value={name}
            error={
              saveResult !== SaveResult.UNKNOWN && (error.general || error.name)
            }
            helperText={error.name ? "Name field cannot be empty" : ""}
            onChange={(e) => {
              setSaveResult(SaveResult.UNKNOWN);
              setError({ ...error, name: false, general: false });
              setName(e.target.value);
              validate(e.target.value, nameRegex, "name");
            }}
          />
          <TextField
            label="email address"
            variant="outlined"
            value={email}
            error={
              saveResult !== SaveResult.UNKNOWN &&
              (error.general || error.email)
            }
            helperText={error.email ? "Incorrect email address" : ""}
            onChange={(e) => {
              setSaveResult(SaveResult.UNKNOWN);
              setError({ ...error, email: false, general: false });
              setEmail(e.target.value);
              validate(e.target.value, emailRegex, "email");
            }}
          />
          <Button
            variant="contained"
            onClick={() => {
              // Use Firebase function
              validate(name, nameRegex, "name");
              validate(email, emailRegex, "email");
              console.log("Save", name, email);
              // This state exist to make sure that errors only occure after pressing the save button
              setSaveResult(SaveResult.PENDING);
              if (Object.values(error).includes(true)) {
                console.log("errors found on save");
                setError({ ...error, general: true });
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
                  .then((result) => {
                    // Read result of the Cloud Function.
                    /** @type {any} */
                    console.log("result from api", result);
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
          </Button>
          {error.general && (
            <div>Unfortuantly there was an error saving, please try again</div>
          )}
          {saveResult === SaveResult.FAIL ? (
            <div>There was an error saving you details</div>
          ) : (
            saveResult === SaveResult.SUCCESS && (
              <div>Your details are saved</div>
            )
          )}
        </Box>
      </>
    )
  );
};

export default Profile;
