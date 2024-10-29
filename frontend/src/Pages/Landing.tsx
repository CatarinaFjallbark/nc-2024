import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const Landing = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(false);

  return (
    <Box>
      <h1>NC 2024</h1>
      <Box sx={{ display: "flex", flexDirection: "column", margin: "1rem" }}>
        <TextField
          sx={{ margin: "1rem" }}
          label="phone number"
          variant="outlined"
          value={phoneNumber}
          error={error}
          helperText={
            error
              ? "Unfortuantly there was an error signing you in, please try again"
              : ""
          }
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            // Use Firebase auth
            console.log("sign in", phoneNumber);
            setError(false);
          }}
        >
          Sign in
        </Button>
      </Box>
    </Box>
  );
};

export default Landing;
