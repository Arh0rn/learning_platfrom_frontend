import { useState } from "react";
import {
    TextField,
    Button,
    Container,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import { resetPassword } from "../api/auth";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
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
            showSnackbar("⚠️ All fields must be filled!", "warning");
            return;
        }

        if (password !== passwordConfirm) {
            showSnackbar("❌ Passwords do not match!", "error");
            return;
        }

        try {
            await resetPassword(email, password, passwordConfirm);

            // Save email in `localStorage` to autofill on the next page
            localStorage.setItem("resetEmail", email);

            showSnackbar(
                "📩 Check your email for the confirmation code!",
                "success"
            );
            setTimeout(() => navigate("/confirm-reset"), 2000);
        } catch (err) {
            showSnackbar(
                err.response?.data?.message || "❌ Password reset failed!",
                "error"
            );
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                🔑 Reset Password
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
                    label="New Password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    fullWidth
                    type="password"
                    label="Confirm New Password"
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
                    Reset Password
                </Button>
            </form>

            {/* Snackbar Notification */}
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

export default ResetPasswordPage;
