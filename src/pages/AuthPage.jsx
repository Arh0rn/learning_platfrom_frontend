import { useState } from "react";
import { TextField, Button, Container, Typography, Alert, Link } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await handleLogin(email, password);
      navigate("/"); // Redirect only if successful
    } catch (err) {
      setError(err.message); // Show the real error message from backend
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Login
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
          type="password"
          label="Password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      <Typography align="center" sx={{ mt: 2 }}>
        <Link component="button" onClick={() => navigate("/reset-password")}>
          Forgot Password?
        </Link>
      </Typography>
    </Container>
  );
};

export default AuthPage;
