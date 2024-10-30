import { useParams } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";
import { useState } from "react";
import { emailRegex, nameRegex } from "../Helpers/Regex";

//Not signed in needs to be handled

const Profile = () => {
  const { phonenumber } = useParams();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [error, setError] = useState(false);
  const [activateError, setActivateError] = useState(false);

  const validateName = (value: string) => {
    //Only add error if user has tried to sign in to improve user experience
    setNameError(activateError && !nameRegex.test(value));
  };

  const validateEmail = (value: string) => {
    //Only add error if user has tried to sign in to improve user experience
    setEmailError(activateError && !emailRegex.test(value));
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          // Use Firebase function
          console.log("Sign out", name, email, phonenumber);
          setError(false);
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
          error={error || nameError}
          helperText={nameError ? "Name field cannot be empty" : ""}
          onChange={(e) => {
            setName(e.target.value);
            validateName(e.target.value);
            setError(false);
          }}
        />
        <TextField
          sx={{ margin: "1rem" }}
          label="email address"
          variant="outlined"
          value={email}
          error={error || emailError}
          helperText={emailError ? "Incorrect email address" : ""}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
            setError(false);
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            // Use Firebase function
            //setError(false);
            validateName(name);
            validateEmail(email);
            console.log("Save", name, email);
            setActivateError(true);
          }}
        >
          Save
        </Button>
        {error && (
          <div>"Unfortuantly there was an error saving, please try again</div>
        )}
      </Box>
    </>
  );
};

export default Profile;
