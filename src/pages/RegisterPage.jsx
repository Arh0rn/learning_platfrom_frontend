import { useState } from "react";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Success message state

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null); // Reset previous messages

    try {
      await register(email, password, passwordConfirm);
      setSuccess("Check your email for the confirmation code!");
      setTimeout(() => navigate("/confirm"), 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
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
          label="Password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          margin="normal"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </form>
    </Container>
  );
};

export default RegisterPage;
