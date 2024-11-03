import { TextField, TextFieldProps } from "@mui/material";

export const MuiTextField = ({ label, value, error, helperText, onChange }:TextFieldProps) => {
    return (<TextField
    sx={{ marginBottom: "1rem", input: { background: '#f5f3f3' } }}
    label={label}
    slotProps={{ inputLabel: { color: 'none' } }}
    variant="filled"
    value={value}
    error={error}
    helperText={helperText}
    onChange={onChange}
  />)
}
