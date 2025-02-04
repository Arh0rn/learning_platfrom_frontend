import { useState } from "react";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";
import { confirmResetPassword } from "../api/auth";
import { useNavigate } from "react-router-dom";

const ConfirmResetPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Reset previous errors

    try {
      await confirmResetPassword(email, code);
      alert("Password reset confirmed!");
      navigate("/login"); // Redirect to login page only on success
    } catch (err) {
      setError(err.response?.data?.message || "Confirmation failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Confirm Password Reset
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
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
          label="Confirmation Code"
          margin="normal"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Confirm Reset
        </Button>
      </form>
    </Container>
  );
};

export default ConfirmResetPage;
