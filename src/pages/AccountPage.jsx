import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Button,
    TextField,
    Box,
    CircularProgress,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

// Import the new API calls
import { getMyProfile, updateMyProfile, deleteMyProfile } from "../api/users";

const AccountPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Local state
    const [profile, setProfile] = useState(null); // holds user data from backend
    const [loading, setLoading] = useState(true); // shows a spinner while fetching
    const [editMode, setEditMode] = useState(false); // toggles the "edit account" form

    // Form fields for editing name/last_name
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");

    useEffect(() => {
        if (!user) {
            // If no user is logged in, redirect to login
            navigate("/login");
            return;
        }

        // Fetch user profile from backend
        const fetchProfile = async () => {
            try {
                const data = await getMyProfile();
                setProfile(data);
                // Initialize form fields
                setName(data.name || "");
                setLastName(data.last_name || "");
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, navigate]);

    // Handle "Save" on edit form
    const handleSave = async () => {
        try {
            await updateMyProfile({ name, last_name: lastName });
            // Update local state without another fetch, or re-fetch if you prefer
            setProfile((prev) => ({
                ...prev,
                name,
                last_name: lastName,
            }));
            setEditMode(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    // Handle "Delete Account"
    const handleDeleteAccount = async () => {
        if (
            !window.confirm(
                "Are you sure you want to delete your account? This cannot be undone."
            )
        ) {
            return;
        }
        try {
            await deleteMyProfile();
            // After successful deletion, log out and redirect
            logout();
            navigate("/login");
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Failed to delete account.");
        }
    };

    // Show spinner while loading
    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
                <CircularProgress />
            </Container>
        );
    }

    // If somehow there's still no profile, show a fallback
    if (!profile) {
        return (
            <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
                <Typography variant="h6">Profile not found.</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Account
            </Typography>

            {/* Display either the read-only info or the edit form */}
            {editMode ? (
                <Box sx={{ mb: 3 }}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        sx={{ mr: 2 }}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => setEditMode(false)}
                    >
                        Cancel
                    </Button>
                </Box>
            ) : (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Email: {profile.email}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Name: {profile.name ? profile.name : "Not set"}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Last Name:{" "}
                        {profile.last_name ? profile.last_name : "Not set"}
                    </Typography>
                </Box>
            )}

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                {/* If not editing, show "Edit Account" button */}
                {!editMode && (
                    <Button
                        variant="contained"
                        color="info"
                        onClick={() => setEditMode(true)}
                    >
                        Edit Account
                    </Button>
                )}

                {/* Delete Account button */}
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteAccount}
                >
                    Delete Account
                </Button>

                {/* Logout button */}
                <Button
                    variant="contained"
                    color="warning"
                    onClick={() => {
                        logout();
                        setTimeout(() => navigate("/login"), 100);
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Container>
    );
};

export default AccountPage;
