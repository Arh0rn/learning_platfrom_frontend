// src/layouts/ForumLayout.jsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { getFaqCategories } from "../api/faq";
import Header from "../components/Header"; // <-- Import your Header
// import Footer from "../components/Footer"; // <-- If you also want a footer

const ForumLayout = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const { catId } = useParams(); // If you’re using /forum/category/:catId

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getFaqCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching forum categories:", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            {/* Top header */}
            <Header />

            {/* Main content area */}
            <Box display="flex" flexGrow={1}>
                {/* Left side (the Outlet where ForumHomePage or ForumQuestionPage will render) */}
                <Box flexGrow={1} p={2}>
                    <Outlet />
                </Box>

                {/* Right sidebar for categories */}
                <Box sx={{ width: 250, p: 2, borderLeft: "1px solid #ccc" }}>
                    <Typography variant="h6" gutterBottom>
                        Categories
                    </Typography>
                    <List>
                        {/* "All" link to show all questions */}
                        <ListItemButton
                            selected={!catId}
                            onClick={() => navigate("/forum")}
                        >
                            <ListItemText primary="All" />
                        </ListItemButton>

                        {categories.map((cat) => (
                            <ListItemButton
                                key={cat.id}
                                selected={catId === cat.id}
                                onClick={() =>
                                    navigate(`/forum/category/${cat.id}`)
                                }
                            >
                                <ListItemText primary={cat.name} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Box>

            {/* Optional footer if you want it at the bottom */}
            {/* <Footer /> */}
        </Box>
    );
};

export default ForumLayout;
