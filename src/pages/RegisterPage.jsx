import { useState } from "react";
import {
    TextField,
    Button,
    Container,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !password || !passwordConfirm) {
            showSnackbar("⚠️ All fields must be filled in!", "warning");
            return;
        }

        if (password !== passwordConfirm) {
            showSnackbar("❌ The passwords do not match!", "error");
            return;
        }

        try {
            await register(email, password, passwordConfirm);

            // Сохраняем email в `localStorage`, чтобы использовать на странице подтверждения
            localStorage.setItem("pendingEmail", email);

            showSnackbar(
                "📩 Check your mail for confirmation code!",
                "success"
            );
            setTimeout(() => navigate("/confirm"), 2000);
        } catch (err) {
            showSnackbar(
                err.response?.data?.message || "❌ Registartion error",
                "error"
            );
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                🔑 Registartion
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    fullWidth
                    type="password"
                    label="password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    fullWidth
                    type="password"
                    label="Confirm password"
                    margin="normal"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    register
                </Button>
            </form>

            {/* Всплывающее уведомление */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default RegisterPage;
