import { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Container,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ConfirmPage = () => {
    const { handleConfirmRegister } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    useEffect(() => {
        // Автоматически подставляем email, если он сохранен
        const savedEmail = localStorage.getItem("pendingEmail");
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
            showSnackbar("⚠️ Enter the confirmation code!", "warning");
            return;
        }

        try {
            await handleConfirmRegister(email, code);
            showSnackbar("✅ Registration Confirmed!", "success");

            // Очистка `localStorage`, так как email больше не нужен
            localStorage.removeItem("pendingEmail");

            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            showSnackbar("❌ Confirmation Error, try again!", "error");
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                ✅ Подтверждение регистрации
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    value={email}
                    disabled // Email теперь нельзя редактировать
                />
                <TextField
                    fullWidth
                    label="Confirmation code"
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
                    Подтвердить
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

export default ConfirmPage;
