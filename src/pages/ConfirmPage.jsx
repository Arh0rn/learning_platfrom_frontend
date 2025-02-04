import { useState } from "react";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ConfirmPage = () => {
  const { handleConfirmRegister } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Reset previous errors

    try {
      await handleConfirmRegister(email, code);
      navigate("/"); // Redirect only if successful
    } catch (err) {
      setError("Confirmation failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Confirm Registration
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth label="Confirmation Code" margin="normal" value={code} onChange={(e) => setCode(e.target.value)} />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Confirm
        </Button>
      </form>
    </Container>
  );
};

export default ConfirmPage;
