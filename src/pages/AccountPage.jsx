import { Container, Typography, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    return (
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Account
            </Typography>
            <Typography variant="h6" gutterBottom>
                Email: {user?.email}
            </Typography>
            <Button
                variant="contained"
                color="error"
                onClick={() => {
                    logout();
                    setTimeout(() => navigate("/login"), 100); // Даем время на удаление данных
                }}
            >
                Logout
            </Button>
        </Container>
    );
};

export default AccountPage;
