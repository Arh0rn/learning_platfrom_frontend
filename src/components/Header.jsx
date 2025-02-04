import { useAuth } from "../context/AuthContext";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        borderRadius: "12px", // Rounded corners
      }}
    >
      <Container>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Online Learning Platform
          </Typography>
          {!user ? (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Register
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => logout()}>
              Logout
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
