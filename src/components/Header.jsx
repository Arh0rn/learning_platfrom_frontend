// src/components/Header.jsx
import { useAuth } from "../context/AuthContext";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Header() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <AppBar
            position="static"
            sx={{
                borderRadius: "5px", // Rounded corners
            }}
        >
            <Container>
                <Toolbar>
                    {/* Clickable Title - Redirects to Home */}
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        Ғылым-base
                    </Typography>

                    {/* Show "Courses" and "My Courses" if user is logged in */}
                    {user && (
                        <>
                            <Button
                                color="inherit"
                                onClick={() => navigate("/courses")}
                            >
                                Courses
                            </Button>
                            <Button
                                color="inherit"
                                onClick={() => navigate("/my-courses")}
                            >
                                My Courses
                            </Button>
                        </>
                    )}

                    {/* Show "Forum" to everyone (or only if logged in, if you prefer) */}
                    <Button color="inherit" onClick={() => navigate("/forum")}>
                        Forum
                    </Button>

                    {/* Auth Buttons */}
                    {!user ? (
                        <>
                            <Button
                                color="inherit"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Button>
                            <Button
                                color="inherit"
                                onClick={() => navigate("/register")}
                            >
                                Register
                            </Button>
                        </>
                    ) : (
                        <Button
                            color="inherit"
                            onClick={() => navigate("/account")}
                        >
                            Account
                        </Button>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;
