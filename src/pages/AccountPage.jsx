import { Container, Typography, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Account
            </Typography>
            <Typography variant="h6" gutterBottom>
                Email: {user.email}
            </Typography>
            <Button
                variant="contained"
                color="error"
                onClick={() => {
                    logout();
                    navigate("/");
                }}
            >
                Logout
            </Button>
        </Container>
    );
};

export default AccountPage;
