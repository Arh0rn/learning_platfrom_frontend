import { Box, Typography, Container } from "@mui/material";

function Footer() {
    return (
        <Box
            sx={{
                bgcolor: "primary.main",
                color: "white",
                py: 2,
                mt: 4,
                borderRadius: "12px", // Rounded corners
            }}
        >
            <Container>
                <Typography variant="body1" align="center">
                    © 2025 | Online Learning Platform by Pick-me Team
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;
