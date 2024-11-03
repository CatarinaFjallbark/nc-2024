import { Button, ButtonProps } from "@mui/material";

export const MuiButton = ({ id, onClick, children, sx }:ButtonProps) => {
    return (<Button
        sx={{ ...sx, background: '#92b3ee', color: '#68135a' }}
        id={id}
        variant="contained"
        onClick={onClick}
        >{children}</Button>
    )
}
