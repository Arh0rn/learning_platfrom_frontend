import { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Container,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import { confirmResetPassword } from "../api/auth";
import { useNavigate } from "react-router-dom";

const ConfirmResetPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    useEffect(() => {
        // Autofill email from localStorage if available
        const savedEmail = localStorage.getItem("resetEmail");
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !code) {
            showSnackbar("⚠️ Please enter the confirmation code!", "warning");
            return;
        }

        try {
            await confirmResetPassword(email, code);
            showSnackbar("✅ Password reset confirmed!", "success");

            // Clear email from localStorage after successful confirmation
            localStorage.removeItem("resetEmail");

            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            showSnackbar("❌ Confirmation failed. Try again!", "error");
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                ✅ Confirm Password Reset
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    value={email}
                    disabled // Prevent editing as it's auto-filled
                />
                <TextField
                    fullWidth
                    label="Confirmation Code"
                    margin="normal"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Confirm Reset
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

export default ConfirmResetPage;
