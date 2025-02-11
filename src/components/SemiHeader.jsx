import { AppBar, Toolbar, Typography } from "@mui/material";

const SemiHeader = ({ courseTitle }) => {
    return (
        <AppBar
            position="static"
            color="primary"
            sx={{ my: 2, borderRadius: "5px" }}
        >
            <Toolbar>
                <Typography variant="h6">{courseTitle}</Typography>
            </Toolbar>
        </AppBar>
    );
};

export default SemiHeader;
