import { TextField as MuiTextField, TextFieldProps } from "@mui/material";

export const TextField = ({ label, value, error, helperText, onChange }:TextFieldProps) => {
    return (<MuiTextField
    sx={{ marginBottom: "1rem" }}
    label={label}
    variant="outlined"
    value={value}
    error={error}
    helperText={helperText}
    onChange={onChange}
  />)
}