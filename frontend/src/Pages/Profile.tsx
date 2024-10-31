import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { emailRegex, nameRegex } from "../Helpers/Regex";
import { auth } from "../../firebase.ts";

type ProfileError = {
  email: boolean;
  name: boolean;
  general: boolean;
};

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
  const [activateError, setActivateError] = useState(false);
  const navigate = useNavigate();

  const validate = (value: string, regex: RegExp, key: keyof ProfileError) => {
    if (!regex.test(value)) {
      setError({ ...error, [key]: true });
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        //const uid = user.uid;
        // ...
        console.log("Signed in");
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
            sx={{ margin: "1rem" }}
            label="first and last name"
            variant="outlined"
            value={name}
            error={activateError && (error.general || error.name)}
            helperText={error.name ? "Name field cannot be empty" : ""}
            onChange={(e) => {
              setError({ ...error, name: false, general: false });
              setName(e.target.value);
              validate(e.target.value, nameRegex, "name");
            }}
          />
          <TextField
            sx={{ margin: "1rem" }}
            label="email address"
            variant="outlined"
            value={email}
            error={activateError && (error.general || error.email)}
            helperText={error.email ? "Incorrect email address" : ""}
            onChange={(e) => {
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
              setActivateError(true);
              if (Object.values(error).includes(false)) {
                setError({ ...error, general: true });
              } else {
                console.log("set data with api");
              }
            }}
          >
            Save
          </Button>
          {error.general && (
            <div>"Unfortuantly there was an error saving, please try again</div>
          )}
        </Box>
      </>
    )
  );
};

export default Profile;
