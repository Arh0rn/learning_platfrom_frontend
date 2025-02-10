import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ textAlign: "center", mt: 8 }}>
            <Typography variant="h2" fontWeight="bold" gutterBottom>
                Ғылым-base
            </Typography>
            <Typography variant="h5" color="textSecondary" gutterBottom>
                The Kazakh Learning Platform for IT and Programming
            </Typography>

            <Box sx={{ my: 4, textAlign: "left" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    1. Project Relevance
                </Typography>
                <Typography variant="body1" paragraph>
                    The proposed project, Ғылым, is a learning platform
                    specializing in IT and programming. It was chosen due to its
                    potential to address the growing demand for accessible,
                    high-quality technical education in Kazakhstan.
                </Typography>
                <Typography variant="body1" paragraph>
                    With the rise of digital transformation, many students,
                    professionals, and lifelong learners are seeking platforms
                    that provide flexible, online learning opportunities
                    specifically focused on programming and IT skills.
                </Typography>
                <Typography variant="body1" paragraph>
                    Current platforms often fail to cater to region-specific
                    needs, such as content in local languages, tailored
                    curricula, or localized certifications. Our platform seeks
                    to fill these gaps by focusing on these underserved aspects,
                    making learning more inclusive and efficient.
                </Typography>
            </Box>

            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate("/courses")}
            >
                Start Learning
            </Button>
        </Container>
    );
};

export default HomePage;
